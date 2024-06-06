package com.movie.service;

import com.movie.dto.ProfileDto;
import com.movie.model.Profile;
import com.movie.repository.ProfileRepository;
import com.movie.request.ProfileCreateRequest;
import com.movie.request.ProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public List<ProfileDto> getAllProfiles() {
        List<Profile> profiles = profileRepository.findAll();
        return profiles.stream()
                .map(ProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProfileDto> getProfilesByUId(Long uId) {
        List<Profile> profiles = profileRepository.findByUId(uId);
        return profiles.stream()
                .map(ProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ResponseEntity<ProfileDto> getProfileById(Integer id) {
        Optional<Profile> profile = profileRepository.findById(id);
        return profile.map(p -> ResponseEntity.ok(ProfileDto.fromEntity(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<ProfileDto> createProfile(ProfileCreateRequest request) {
        Profile profile = new Profile(request.getUId(), request.getPName(), request.getPImage(), request.getAge());
        profile = profileRepository.save(profile);
        return new ResponseEntity<>(ProfileDto.fromEntity(profile), HttpStatus.CREATED);
    }

    public ProfileDto updateProfile(int profileId, ProfileUpdateRequest request) {
        Optional<Profile> optionalProfile = profileRepository.findById(profileId);
        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();
            profile.setPName(request.getPName());
            profile.setPImage(request.getPImage());
            profile.setAge(request.getAge());
            profile = profileRepository.save(profile);
            return ProfileDto.fromEntity(profile);
        } else {
            return null;
        }
    }
}
