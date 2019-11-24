package com.tm.parcelsupply.Mapper;

import com.tm.parcelsupply.Dto.TaskStatusDto;
import com.tm.parcelsupply.Model.TaskStatus;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TaskStatusMapper {

    TaskStatusMapper INSTANCE = Mappers.getMapper(TaskStatusMapper.class);

    TaskStatusDto mapEntity(TaskStatus taskStatus);
}
