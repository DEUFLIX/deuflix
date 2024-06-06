package com.movie.controller;

import com.movie.dto.ProfileDto;
import com.movie.request.ProfileCreateRequest;
import com.movie.request.ProfileUpdateRequest;
import com.movie.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public List<ProfileDto> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{uId}")
    public List<ProfileDto> getProfilesByUId(@PathVariable Long uId) {
        return profileService.getProfilesByUId(uId);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileDto> getProfileById(@PathVariable Integer id) {
        return profileService.getProfileById(id);
    }

    @PostMapping("/insert")
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileCreateRequest request) {
        return profileService.createProfile(request);
    }

    @PutMapping("/update/{profileId}")
    public ResponseEntity<ProfileDto> updateProfile(@PathVariable int profileId, @RequestBody ProfileUpdateRequest request) {
        ProfileDto updatedProfile = profileService.updateProfile(profileId, request);
        if (updatedProfile != null) {
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
