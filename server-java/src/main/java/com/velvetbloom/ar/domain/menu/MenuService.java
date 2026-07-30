package com.velvetbloom.ar.domain.menu;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.common.Slugs;
import com.velvetbloom.ar.domain.analytics.AnalyticsService;
import com.velvetbloom.ar.service.CloudinaryService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MenuService {

    private final MenuItemRepository repository;
    private final CloudinaryService cloudinary;
    private final AnalyticsService analyticsService;

    public MenuService(MenuItemRepository repository, CloudinaryService cloudinary,
                       AnalyticsService analyticsService) {
        this.repository = repository;
        this.cloudinary = cloudinary;
        this.analyticsService = analyticsService;
    }

    public Page<MenuItem> getMenuItems(UUID restaurantId, MenuQuery query) {
        Sort sort = switch (query.sort() == null ? "createdAt" : query.sort()) {
            case "price" -> Sort.by(Sort.Direction.ASC, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "popular" -> Sort.by(Sort.Direction.DESC, "totalOrders");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        int page = Math.max(query.page(), 1);
        int limit = query.limit() > 0 ? query.limit() : 20;
        PageRequest pageable = PageRequest.of(page - 1, limit, sort);

        Specification<MenuItem> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("restaurantId"), restaurantId));
            if (query.category() != null) predicates.add(cb.equal(root.get("category"), query.category()));
            if (query.type() != null) predicates.add(cb.equal(root.get("type"), query.type()));
            if (query.available() != null) predicates.add(cb.equal(root.get("isAvailable"), query.available()));
            if (Boolean.TRUE.equals(query.featured())) predicates.add(cb.isTrue(root.get("isFeatured")));
            if (query.search() != null && !query.search().isBlank()) {
                String like = "%" + query.search().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return repository.findAll(spec, pageable);
    }

    public MenuItem getMenuItem(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Menu item not found"));
    }

    public List<MenuItem> getFeatured(UUID restaurantId) {
        return repository.findFeatured(restaurantId);
    }

    public List<MenuItem> getRecommended(UUID restaurantId) {
        return repository.findRecommended(restaurantId);
    }

    @Transactional
    public MenuItem create(MenuItem item) {
        item.setId(null);
        item.setSlug(Slugs.slugify(item.getName()) + "-" + System.currentTimeMillis());
        if (item.getImages() != null && !item.getImages().isEmpty()) {
            item.setThumbnail(item.getImages().get(0));
        }
        return repository.save(item);
    }

    @Transactional
    public MenuItem update(UUID id, MenuItem incoming) {
        MenuItem existing = getMenuItem(id);
        incoming.setId(existing.getId());
        incoming.setCreatedAt(existing.getCreatedAt());
        if (incoming.getSlug() == null) incoming.setSlug(existing.getSlug());
        if (incoming.getImages() != null && !incoming.getImages().isEmpty()) {
            incoming.setThumbnail(incoming.getImages().get(0));
        }
        return repository.save(incoming);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw ApiException.notFound("Menu item not found");
        repository.deleteById(id);
    }

    @Transactional
    public void trackArView(UUID id) {
        MenuItem item = getMenuItem(id);
        item.setArViews(item.getArViews() + 1);
        repository.save(item);
        analyticsService.incrementArView(item.getRestaurantId());
    }

    @Transactional
    public MenuItem uploadImages(UUID id, List<MultipartFile> images) {
        MenuItem item = getMenuItem(id);
        List<String> urls = new ArrayList<>(item.getImages());
        for (MultipartFile file : images) {
            urls.add(cloudinary.uploadImage(file, "images"));
        }
        item.setImages(urls);
        if (!urls.isEmpty()) item.setThumbnail(urls.get(0));
        return repository.save(item);
    }

    @Transactional
    public MenuItem uploadModel(UUID id, MultipartFile glb, MultipartFile usdz, MultipartFile poster) {
        MenuItem item = getMenuItem(id);
        MenuItem.Model3d current = item.getModel3d() != null ? item.getModel3d() : new MenuItem.Model3d(null, null, null);
        String glbUrl = glb != null && !glb.isEmpty() ? cloudinary.uploadRaw(glb, "models") : current.glb();
        String usdzUrl = usdz != null && !usdz.isEmpty() ? cloudinary.uploadRaw(usdz, "models") : current.usdz();
        String posterUrl = poster != null && !poster.isEmpty() ? cloudinary.uploadImage(poster, "models") : current.poster();
        item.setModel3d(new MenuItem.Model3d(glbUrl, usdzUrl, posterUrl));
        return repository.save(item);
    }

    /** Query params for the menu listing. */
    public record MenuQuery(UUID category, String type, String search, String sort,
                            int page, int limit, Boolean featured, Boolean available) {}
}
