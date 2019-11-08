package com.tm.parcelsupply.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateParcelRequestDto {
    //location
    private Double lat;
    private Double lng;

    //size
    private Double height;
    private Double width;
    private Double length;
}
