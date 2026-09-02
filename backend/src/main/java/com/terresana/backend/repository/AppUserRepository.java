package com.terresana.backend.repository;

import com.terresana.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    // Utilisé au login : retrouver un bénévole par son email
    Optional<AppUser> findByEmail(String email);

    // Utilisé à l'inscription : vérifier qu'aucun compte n'existe déjà avec cet email (RG-01)
    boolean existsByEmail(String email);

    // Utilisé à la réinitialisation du mot de passe : retrouver le bénévole via son jeton (RG-04)
    Optional<AppUser> findByResetToken(String resetToken);
}
