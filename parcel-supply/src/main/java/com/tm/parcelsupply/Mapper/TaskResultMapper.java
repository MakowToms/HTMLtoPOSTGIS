package com.tm.parcelsupply.Mapper;

import com.tm.parcelsupply.Dto.TaskResultDto;
import com.tm.parcelsupply.Model.TaskResult;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TaskResultMapper {

    TaskResultMapper INSTANCE = Mappers.getMapper(TaskResultMapper.class);

    TaskResultDto mapEntity(TaskResult taskResult);
}
