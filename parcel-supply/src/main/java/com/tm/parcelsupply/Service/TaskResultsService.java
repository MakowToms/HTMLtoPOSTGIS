package com.tm.parcelsupply.Service;

import com.tm.parcelsupply.Dto.TaskResultDto;
import com.tm.parcelsupply.Mapper.TaskResultMapper;
import com.tm.parcelsupply.Model.ParcelEntity;
import com.tm.parcelsupply.Model.TaskResult;
import com.tm.parcelsupply.Model.TaskStatus;
import com.tm.parcelsupply.Repository.ParcelRepository;
import com.tm.parcelsupply.Repository.TaskResultRepository;
import com.tm.parcelsupply.Repository.TaskStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskResultsService {
    @PersistenceContext
    private EntityManager entityManager;
    private final ParcelRepository parcelRepository;
    private final TaskResultRepository taskResultRepository;

    public void createRandomResult(TaskStatus taskStatus) {
        List<ParcelEntity> parcelEntityList = parcelRepository.findAll();
        if (parcelEntityList == null || parcelEntityList.size() == 0) {
            return;
        }
        Collections.shuffle(parcelEntityList);
        Random random = new Random();
        int howMany = random.nextInt(parcelEntityList.size());
        for (int i = 0; i < howMany; i++) {
            TaskResult taskResult = TaskResult.builder()
                    .numberOfPoint((long) i)
                    .taskStatus(taskStatus)
                    .parcelEntity(parcelEntityList.get(i))
                    .build();
            taskResultRepository.saveAndFlush(taskResult);
        }
    }

    public List<TaskResultDto> getAllByTaskId(Long taskId) {
        return taskResultRepository.getAllByTaskStatus_TaskId(taskId)
                .stream()
                .map(TaskResultMapper.INSTANCE::mapEntity)
                .collect(Collectors.toList());
    }
}
