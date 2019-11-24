package com.tm.parcelsupply.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskResultDto {
    private Long resultId;
    private TaskStatusDto taskStatus;
    private ParcelDto parcelEntity;
    private Long numberOfPoint;
}
