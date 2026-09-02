package com.terresana.backend.controller;

import com.terresana.backend.model.BlogPost;
import com.terresana.backend.repository.BlogPostRepository;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostRepository repo;

    public BlogPostController(BlogPostRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<BlogPost> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public BlogPost create(@RequestBody @NonNull BlogPost post) {
        return repo.save(post);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public BlogPost update(@PathVariable Long id, @RequestBody BlogPost post) {
        post.setId(id);
        return repo.save(post);
    }
}