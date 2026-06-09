package com.tasktracker.service;

import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.model.Project;
import com.tasktracker.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    public Project create(Project project) {
        return projectRepository.save(project);
    }

    public Project update(Long id, Project updated) {
        Project existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        return projectRepository.save(existing);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
