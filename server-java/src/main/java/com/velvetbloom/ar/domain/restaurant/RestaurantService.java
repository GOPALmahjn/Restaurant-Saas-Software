package com.velvetbloom.ar.domain.restaurant;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.common.Slugs;
import com.velvetbloom.ar.config.AppProperties;
import com.velvetbloom.ar.service.CloudinaryService;
import com.velvetbloom.ar.service.QrCodeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;
    private final QrCodeService qrCodeService;
    private final CloudinaryService cloudinary;
    private final AppProperties props;

    public RestaurantService(RestaurantRepository repository, QrCodeService qrCodeService,
                             CloudinaryService cloudinary, AppProperties props) {
        this.repository = repository;
        this.qrCodeService = qrCodeService;
        this.cloudinary = cloudinary;
        this.props = props;
    }

    public Restaurant getBySlug(String slug) {
        return repository.findActiveBySlug(slug)
                .orElseThrow(() -> ApiException.notFound("Restaurant not found"));
    }

    public Restaurant getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Restaurant not found"));
    }

    @Transactional
    public Restaurant create(Restaurant restaurant, UUID ownerId) {
        restaurant.setId(null);
        restaurant.setSlug(Slugs.slugify(restaurant.getName()));
        restaurant.setOwnerId(ownerId);
        restaurant.setTables(withTableQrCodes(restaurant.getId(), restaurant.getTables()));
        Restaurant saved = repository.save(restaurant);
        // regenerate QR codes now that the real id exists
        saved.setTables(withTableQrCodes(saved.getId(), saved.getTables()));
        return repository.save(saved);
    }

    @Transactional
    public Restaurant update(UUID id, Restaurant incoming) {
        Restaurant existing = getById(id);
        incoming.setId(existing.getId());
        incoming.setOwnerId(existing.getOwnerId());
        incoming.setCreatedAt(existing.getCreatedAt());
        if (incoming.getName() != null) {
            incoming.setSlug(Slugs.slugify(incoming.getName()));
        } else {
            incoming.setSlug(existing.getSlug());
        }
        return repository.save(incoming);
    }

    public Map<String, Object> generateTableQrCode(UUID restaurantId, int tableNumber) {
        String url = tableUrl(restaurantId, tableNumber);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("qrCode", qrCodeService.toDataUrl(url));
        data.put("url", url);
        return data;
    }

    public List<Map<String, Object>> generateAllTableQrCodes(UUID id) {
        Restaurant restaurant = getById(id);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Restaurant.TableInfo table : restaurant.getTables()) {
            String url = tableUrl(id, table.tableNumber());
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("tableNumber", table.tableNumber());
            entry.put("qrCode", qrCodeService.toDataUrl(url));
            entry.put("url", url);
            result.add(entry);
        }
        return result;
    }

    @Transactional
    public Restaurant uploadImages(UUID id, MultipartFile logo, MultipartFile cover) {
        Restaurant restaurant = getById(id);
        if (logo != null && !logo.isEmpty()) restaurant.setLogo(cloudinary.uploadImage(logo, "logos"));
        if (cover != null && !cover.isEmpty()) restaurant.setCoverImage(cloudinary.uploadImage(cover, "logos"));
        return repository.save(restaurant);
    }

    private List<Restaurant.TableInfo> withTableQrCodes(UUID restaurantId, List<Restaurant.TableInfo> tables) {
        if (tables == null || tables.isEmpty()) return new ArrayList<>();
        List<Restaurant.TableInfo> updated = new ArrayList<>();
        for (Restaurant.TableInfo t : tables) {
            String qr = restaurantId != null
                    ? qrCodeService.toDataUrl(tableUrl(restaurantId, t.tableNumber()))
                    : t.qrCode();
            updated.add(new Restaurant.TableInfo(t.tableNumber(), qr, t.capacity(), t.isActive()));
        }
        return updated;
    }

    private String tableUrl(UUID restaurantId, Integer tableNumber) {
        return props.getClientUrl() + "/menu/" + restaurantId + "?table=" + tableNumber;
    }
}
