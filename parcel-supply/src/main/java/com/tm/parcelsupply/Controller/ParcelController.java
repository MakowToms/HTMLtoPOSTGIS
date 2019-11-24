package com.tm.parcelsupply.Controller;


import com.tm.parcelsupply.Command.CreateNewParcelCommand;
import com.tm.parcelsupply.Command.FetchParcelsCommand;
import com.tm.parcelsupply.Command.UpdateParcelCommand;
import com.tm.parcelsupply.Dto.ParcelDto;
import com.tm.parcelsupply.Service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parcel")
public class ParcelController {

    private final ParcelService parcelService;

    @GetMapping("/all")
    public List<ParcelDto> getAllParcels() {
        return parcelService.getAllParcels();
    }

    @GetMapping()
    public Page<ParcelDto> getExamplesPaginated(FetchParcelsCommand command){
        return parcelService.getParcelsPaginated(command);
    }

    @PostMapping()
    public ResponseEntity createParcel(@Valid @RequestBody CreateNewParcelCommand command) {
        try{
            System.out.println("Something");
            parcelService.createParcel(command);
        }catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping()
    public ResponseEntity updateParcelAllAttributes(UpdateParcelCommand command){
        try{
            parcelService.updateParcelAllAttributes(command);
        }catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/{parcelId}")
    public ResponseEntity updateParcelAllAttributes(@PathVariable("parcelId") Long parcelId, @RequestBody UpdateParcelCommand command){
        command.setParcelId(parcelId);
        return updateParcelAllAttributes(command);
    }

    @PatchMapping()
    public ResponseEntity updateParcelSelectedAttributes(UpdateParcelCommand command){
        try{
            parcelService.updateParcelSelectedAttributes(command);
        }catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/{parcelId}")
    public ResponseEntity updateParcelSelectedAttributes(@PathVariable("parcelId") Long parcelId, @RequestBody UpdateParcelCommand command){
        command.setParcelId(parcelId);
        return updateParcelSelectedAttributes(command);
    }

    @DeleteMapping("/{parcelId}")
    public ResponseEntity deleteParcel(@PathVariable("parcelId") Long parcelId) {
        try{
            parcelService.deleteParcel(parcelId);
        }catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
