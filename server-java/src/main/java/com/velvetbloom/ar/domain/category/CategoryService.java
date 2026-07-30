package com.velvetbloom.ar.domain.category;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.common.Slugs;
import com.velvetbloom.ar.service.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository repository;
    private final CloudinaryService cloudinary;

    public CategoryService(CategoryRepository repository, CloudinaryService cloudinary) {
        this.repository = repository;
        this.cloudinary = cloudinary;
    }

    public List<Category> getCategories(UUID restaurantId) {
        return repository.findActiveByRestaurant(restaurantId);
    }

    @Transactional
    public Category create(CategoryDtos.CreateRequest req) {
        Category category = new Category();
        category.setName(req.name());
        category.setSlug(Slugs.slugify(req.name()));
        category.setDescription(req.description());
        category.setImage(req.image());
        category.setIcon(req.icon());
        category.setRestaurantId(req.restaurantId());
        if (req.color() != null) category.setColor(req.color());
        int order = repository.findTopOrder(req.restaurantId())
                .map(c -> c.getOrder() + 1).orElse(0);
        category.setOrder(order);
        return repository.save(category);
    }

    @Transactional
    public Category update(UUID id, CategoryDtos.UpdateRequest req) {
        Category category = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Category not found"));
        if (req.name() != null) {
            category.setName(req.name());
            category.setSlug(Slugs.slugify(req.name()));
        }
        if (req.description() != null) category.setDescription(req.description());
        if (req.image() != null) category.setImage(req.image());
        if (req.icon() != null) category.setIcon(req.icon());
        if (req.color() != null) category.setColor(req.color());
        if (req.isActive() != null) category.setActive(req.isActive());
        return repository.save(category);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw ApiException.notFound("Category not found");
        }
        repository.deleteById(id);
    }

    @Transactional
    public void reorder(List<CategoryDtos.ReorderEntry> entries) {
        for (CategoryDtos.ReorderEntry entry : entries) {
            repository.findById(entry.id()).ifPresent(c -> {
                c.setOrder(entry.order());
                repository.save(c);
            });
        }
    }

    @Transactional
    public Category uploadImage(UUID id, MultipartFile image) {
        Category category = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Category not found"));
        category.setImage(cloudinary.uploadImage(image, "categories"));
        return repository.save(category);
    }

    /** DTOs */
    public static final class CategoryDtos {
        private CategoryDtos() {}
        public record CreateRequest(String name, String description, String image, String icon,
                                    UUID restaurantId, String color) {}
        public record UpdateRequest(String name, String description, String image, String icon,
                                    String color, Boolean isActive) {}
        public record ReorderEntry(UUID id, int order) {}
        public record ReorderRequest(List<ReorderEntry> categories) {}
    }
}
