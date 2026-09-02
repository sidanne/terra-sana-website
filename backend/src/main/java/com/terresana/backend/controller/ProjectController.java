package com.terresana.backend.controller;

import com.terresana.backend.model.Project;
import com.terresana.backend.repository.ProjectRepository;
import com.terresana.backend.service.ProjectImageService;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository repo;
    private final ProjectImageService projectImageService;

    public ProjectController(ProjectRepository repo, ProjectImageService projectImageService) {
        this.repo = repo;
        this.projectImageService = projectImageService;
    }

    @GetMapping
    public List<Project> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable @NonNull Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    @PostMapping
    public Project create(@RequestBody @NonNull Project project) {
        Project safeProject = Objects.requireNonNull(project);
        // Si l'admin n'a pas fourni d'image, on en choisit une automatiquement selon le sujet du projet
        if (safeProject.getImage() == null || safeProject.getImage().isBlank()) {
            safeProject.setImage(projectImageService.pickImageFor(safeProject.getName(), safeProject.getDescription()));
        }
        return repo.save(safeProject);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable @NonNull Long id, @RequestBody @NonNull Project project) {
        Project safeProject = Objects.requireNonNull(project);
        safeProject.setId(id);
        if (safeProject.getImage() == null || safeProject.getImage().isBlank()) {
            safeProject.setImage(projectImageService.pickImageFor(safeProject.getName(), safeProject.getDescription()));
        }
        return repo.save(safeProject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repo.deleteById(id);
    }
}