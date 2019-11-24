package com.tm.parcelsupply.Repository;

import com.tm.parcelsupply.Model.ParcelEntity;
import com.tm.parcelsupply.Model.TaskResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskResultRepository extends JpaRepository<TaskResult, Long> {
    List<TaskResult> getAllByTaskStatus_TaskId(Long taskId);
}
