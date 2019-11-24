package com.tm.parcelsupply.Service;

import com.tm.parcelsupply.Model.TaskStatus;
import com.tm.parcelsupply.Repository.TaskStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TaskService {
    @PersistenceContext
    private EntityManager entityManager;
    private final TaskStatusRepository taskStatusRepository;
    private final TaskResultsService taskResultsService;

    public TaskStatus createNewTask() {
        TaskStatus taskStatus = TaskStatus.builder()
                .status("inQueue")
                .build();
        taskStatus = taskStatusRepository.saveAndFlush(taskStatus);
        return taskStatus;
    }

    public TaskStatus findEntityById(Long id){
        Optional<TaskStatus> optionalParcelEntity = taskStatusRepository.findById(id);
        if(!optionalParcelEntity.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task with id " + id + " not found.");
        }
        return optionalParcelEntity.get();
    }

    @Scheduled(fixedDelay = 100, initialDelay = 10500)
    public void proceedTasks() {
        List<TaskStatus> taskStatusList = taskStatusRepository.findAllByStatusEquals("inQueue");
        ExecutorService executorService = Executors.newCachedThreadPool();
        for(int i=0; i<2; i++) {
            if (taskStatusList.size()>i) {
                TaskStatus taskStatus = taskStatusList.get(i);
                executorService.execute(new Runnable() {
                    @Override
                    public void run() {
                        runTask(taskStatus);
                    }
                });
            }
        }
        executorService.shutdown();
        try {
            boolean finished = executorService.awaitTermination(100, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void runTask(TaskStatus taskStatus) {
        System.out.println(taskStatus);
        taskStatus.setStatus("inProcess");
        taskStatusRepository.saveAndFlush(taskStatus);
        try {
            long a = 0;
            for (long i = 0; i < 10000000000L; i++) {
                a += i;
            }
            System.out.println(a);
            taskResultsService.createRandomResult(taskStatus);
            taskStatus.setStatus("finished");
            taskStatusRepository.saveAndFlush(taskStatus);
        } catch (Exception e) {
            e.printStackTrace();
            taskStatus.setStatus("inQueue");
            taskStatusRepository.saveAndFlush(taskStatus);
        }
    }
}
