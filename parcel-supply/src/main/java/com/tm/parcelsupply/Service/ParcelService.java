package com.tm.parcelsupply.Service;

import com.tm.parcelsupply.Command.CreateNewParcelCommand;
import com.tm.parcelsupply.Command.FetchParcelsCommand;
import com.tm.parcelsupply.Command.UpdateParcelCommand;
import com.tm.parcelsupply.Dto.ParcelDto;
import com.tm.parcelsupply.Mapper.ParcelMapper;
import com.tm.parcelsupply.Model.ParcelEntity;
import com.tm.parcelsupply.Repository.ParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ParcelRepository parcelRepository;

    public List<ParcelDto> getAllParcels() {
        return parcelRepository.findAll()
                .stream()
                .map(ParcelMapper.INSTANCE::mapEntity)
                .collect(Collectors.toList());
    }

    public Page<ParcelDto> getParcelsPaginated(FetchParcelsCommand command){
        //it is possible to create complicated rules of sorting
        Sort sort = Sort.by(Sort.Direction.ASC, "parcelId");
        Pageable pageable = PageRequest.of(command.getPage(), command.getPerPage(), sort);
        Page<ParcelEntity> page = parcelRepository.findAll(pageable);
        return page.map(ParcelMapper.INSTANCE::mapEntity);
    }

    @Transactional
    public void createParcel(CreateNewParcelCommand command) {
        System.out.println("Something 2");
        ParcelEntity parcelEntity = ParcelEntity.builder()
                .lat(command.getLat())
                .lng(command.getLng())
                .height(command.getHeight())
                .width(command.getWidth())
                .length(command.getLength())
                .build();
//        if (parcelEntity.getWidth() == null || parcelEntity.getLength() == null || parcelEntity.getHeight() == null
//                || parcelEntity.getLat() == null || parcelEntity.getLng() == null) {
//            return new ParcelEntity();
//        }
        entityManager.persist(parcelEntity);
//        parcelEntity = parcelRepository.saveAndFlush(parcelEntity);
//        return parcelEntity;
    }

    @Transactional
    public void updateParcelAllAttributes(UpdateParcelCommand command){
        //Return BAD REQUEST when update command do not have key
        Long id = Optional.ofNullable(command.getParcelId()).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not passed id to update"));
        ParcelEntity parcelEntity = findEntityById(id);
        parcelEntity.setHeight(command.getHeight());
        parcelEntity.setWidth(command.getWidth());
        parcelEntity.setLength(command.getLength());
        parcelEntity.setLat(command.getLat());
        parcelEntity.setLng(command.getLng());
        entityManager.persist(parcelEntity);
    }

    @Transactional
    public void updateParcelSelectedAttributes(UpdateParcelCommand command){
        //Return BAD REQUEST when update command do not have key
        Long id = Optional.ofNullable(command.getParcelId()).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not passed id to update"));
        ParcelEntity parcelEntity = findEntityById(id);
        if (command.getLength() != null) {
            parcelEntity.setLength(command.getLength());
        }
        if (command.getHeight() != null) {
            parcelEntity.setHeight(command.getHeight());
        }
        if (command.getWidth() != null) {
            parcelEntity.setWidth(command.getWidth());
        }
        if (command.getLat() != null) {
            parcelEntity.setLat(command.getLat());
        }
        if (command.getLng() != null) {
            parcelEntity.setLng(command.getLng());
        }
        entityManager.persist(parcelEntity);
    }

    @Transactional
    public void deleteParcel(Long id){
        ParcelEntity parcelEntity = findEntityById(id);
        entityManager.remove(parcelEntity);
    }

    private ParcelEntity findEntityById(Long id){
        Optional<ParcelEntity> optionalParcelEntity = parcelRepository.findByParcelId(id);
        if(!optionalParcelEntity.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parcel with id " + id + " not found.");
        }
        return optionalParcelEntity.get();
    }
}
