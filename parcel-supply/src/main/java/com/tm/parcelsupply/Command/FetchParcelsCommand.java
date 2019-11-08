package com.tm.parcelsupply.Command;

import lombok.*;

import javax.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FetchParcelsCommand {
    protected Integer page = 0;
    @Max(500)
    protected Integer perPage = 50;
}
