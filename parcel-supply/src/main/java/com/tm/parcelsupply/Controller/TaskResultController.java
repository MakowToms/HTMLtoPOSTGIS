package com.tm.parcelsupply.Controller;

import com.tm.parcelsupply.Dto.TaskResultDto;
import com.tm.parcelsupply.Mapper.TaskResultMapper;
import com.tm.parcelsupply.Service.TaskResultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/taskResult")
public class TaskResultController {
    private final TaskResultsService taskResultsService;

    @GetMapping("/{taskId}")
    public List<TaskResultDto> getTaskResults(@PathVariable("taskId") Long taskId){
        return taskResultsService.getAllByTaskId(taskId);
    }
}
