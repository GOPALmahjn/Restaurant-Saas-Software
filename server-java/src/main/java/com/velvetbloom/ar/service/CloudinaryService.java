package com.velvetbloom.ar.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.velvetbloom.ar.common.ApiException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/** Thin wrapper over the Cloudinary SDK for image / 3D-model uploads. */
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /** Upload an image, returns the secure URL. */
    public String uploadImage(MultipartFile file, String folder) {
        return upload(file, folder, "image");
    }

    /** Upload a raw asset (GLB/GLTF/USDZ 3D models), returns the secure URL. */
    public String uploadRaw(MultipartFile file, String folder) {
        return upload(file, folder, "raw");
    }

    private String upload(MultipartFile file, String folder, String resourceType) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("No file provided for upload");
        }
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "restaurant-ar/" + folder,
                            "resource_type", resourceType
                    ));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new ApiException("Upload failed: " + e.getMessage(),
                    org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
