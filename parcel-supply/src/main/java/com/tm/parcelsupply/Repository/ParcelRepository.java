package com.tm.parcelsupply.Repository;

import com.tm.parcelsupply.Model.ParcelEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<ParcelEntity, Long> {
    ParcelEntity findAllByParcelId(Long id);

    Page<ParcelEntity> findAll(Pageable pageable);

    Optional<ParcelEntity> findByParcelId(Long id);
}
