package com.tm.parcelsupply.Controller;

import com.tm.parcelsupply.Command.CreateNewParcelCommand;
import com.tm.parcelsupply.Command.FetchParcelsCommand;
import com.tm.parcelsupply.Dto.ParcelDto;
import com.tm.parcelsupply.Dto.TaskStatusDto;
import com.tm.parcelsupply.Mapper.TaskStatusMapper;
import com.tm.parcelsupply.Model.TaskStatus;
import com.tm.parcelsupply.Service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/task")
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/{taskId}")
    public TaskStatusDto getTaskStatusStatus(@PathVariable("taskId") Long taskId){
        return TaskStatusMapper.INSTANCE.mapEntity(taskService.findEntityById(taskId));
    }

    @PostMapping()
    public TaskStatusDto createTask() {
        return TaskStatusMapper.INSTANCE.mapEntity(taskService.createNewTask());
    }
}
