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
    private Double lat;
    private Double lng;

    //size
    private Double height;
    private Double width;
    private Double length;
}
