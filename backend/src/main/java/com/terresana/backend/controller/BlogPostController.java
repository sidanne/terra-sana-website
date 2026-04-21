package com.terresana.backend.controller;

import com.terresana.backend.model.BlogPost;
import com.terresana.backend.repository.BlogPostRepository;
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
        return repo.findAll();
    }

    @PostMapping
    public BlogPost create(@RequestBody BlogPost post) {
        return repo.save(post);
    }
}