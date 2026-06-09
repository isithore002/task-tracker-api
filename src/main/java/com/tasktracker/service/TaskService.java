package com.tasktracker.service;

import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.model.Project;
import com.tasktracker.model.Task;
import com.tasktracker.repository.ProjectRepository;
import com.tasktracker.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<Task> getAll() { return taskRepository.findAll(); }

    public List<Task> getByStatus(String status) {
        return taskRepository.findByStatus(status.toUpperCase());
    }

    public List<Task> getByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task getById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    public Task create(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        task.setProject(project);
        return taskRepository.save(task);
    }

    public Task update(Long id, Task updated) {
        Task existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setDueDate(updated.getDueDate());
        return taskRepository.save(existing);
    }

    public Task updateStatus(Long id, String status) {
        Task task = getById(id);
        task.setStatus(status.toUpperCase());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
