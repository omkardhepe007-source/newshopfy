package com.shopeasy.service;

import com.shopeasy.dto.ProductDTO;
import com.shopeasy.entity.Product;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductService - Business logic for product management.
 *
 * Admin operations: create, update, delete (soft delete - sets active=false)
 * Customer operations: browse all, search by keyword, filter by category
 *
 * Uses mapToResponse() helper to convert entities to DTOs,
 * keeping the service layer clean and the entity unexposed.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ========== ADMIN OPERATIONS ==========

    @Transactional
    public ProductDTO.Response createProduct(ProductDTO.Request request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();
        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductDTO.Response updateProduct(Long id, ProductDTO.Request request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false); // Soft delete to preserve order history
        productRepository.save(product);
    }

    public List<ProductDTO.Response> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ========== CUSTOMER OPERATIONS ==========

    public List<ProductDTO.Response> getAllActiveProducts() {
        return productRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductDTO.Response getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    public List<ProductDTO.Response> searchProducts(String keyword, String category) {
        List<Product> products;
        if (keyword != null && !keyword.isBlank() && category != null && !category.isBlank()) {
            products = productRepository.searchByKeywordAndCategory(keyword, category);
        } else if (keyword != null && !keyword.isBlank()) {
            products = productRepository.searchByKeyword(keyword);
        } else if (category != null && !category.isBlank()) {
            products = productRepository.findByCategoryAndActiveTrue(category);
        } else {
            products = productRepository.findByActiveTrueOrderByCreatedAtDesc();
        }
        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    // ========== MAPPER ==========

    private ProductDTO.Response mapToResponse(Product product) {
        ProductDTO.Response response = new ProductDTO.Response();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setImageUrl(product.getImageUrl());
        response.setActive(product.isActive());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
}
