package com.tm.parcelsupply.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "parcel")
public class ParcelEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "parcel_id", nullable = false, updatable = false)
    private Long parcelId;

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
