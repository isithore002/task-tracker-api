package com.tasktracker.controller;

import com.tasktracker.model.Task;
import com.tasktracker.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET /api/tasks  OR  /api/tasks?status=TODO
    @GetMapping("/tasks")
    public List<Task> getAll(@RequestParam(required = false) String status) {
        return status != null ? taskService.getByStatus(status) : taskService.getAll();
    }

    // GET /api/tasks/{id}
    @GetMapping("/tasks/{id}")
    public Task getById(@PathVariable Long id) {
        return taskService.getById(id);
    }

    // GET /api/projects/{projectId}/tasks
    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return taskService.getByProject(projectId);
    }

    // POST /api/projects/{projectId}/tasks
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> create(@PathVariable Long projectId,
                                       @Valid @RequestBody Task task) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(projectId, task));
    }

    // PUT /api/tasks/{id}
    @PutMapping("/tasks/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody Task task) {
        return taskService.update(id, task);
    }

    // PATCH /api/tasks/{id}/status?status=DONE
    @PatchMapping("/tasks/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestParam String status) {
        return taskService.updateStatus(id, status);
    }

    // DELETE /api/tasks/{id}
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
