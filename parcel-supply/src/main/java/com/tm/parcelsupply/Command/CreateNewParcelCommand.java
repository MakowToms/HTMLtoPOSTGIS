package com.tm.parcelsupply.Command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CreateNewParcelCommand {
    //location
    private Double lat;
    private Double lng;

    //size
    private Double height;
    private Double width;
    private Double length;
}
