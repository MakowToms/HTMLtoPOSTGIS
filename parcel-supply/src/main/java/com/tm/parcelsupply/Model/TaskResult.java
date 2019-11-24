package com.tm.parcelsupply.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "results")
public class TaskResult {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "result_id", nullable = false, updatable = false)
    private Long resultId;

    @JoinColumn(name = "task_id", referencedColumnName = "task_id")
    @ManyToOne
    private TaskStatus taskStatus;

    @JoinColumn(name = "parcel_id", referencedColumnName = "parcel_id")
    @ManyToOne
    private ParcelEntity parcelEntity;

    private Long numberOfPoint;
}
