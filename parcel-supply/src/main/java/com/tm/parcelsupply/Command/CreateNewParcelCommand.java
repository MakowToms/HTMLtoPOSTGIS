package com.tm.parcelsupply.Command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CreateNewParcelCommand {
    //location
    @NotNull
    private Double lat;
    @NotNull
    private Double lng;

    //size
    @NotNull
    private Double height;
    @NotNull
    private Double width;
    @NotNull
    private Double length;
}
