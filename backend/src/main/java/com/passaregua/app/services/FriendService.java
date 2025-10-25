package com.passaregua.app.services;
import org.springframework.transaction.annotation.Transactional;
import com.passaregua.app.models.Friendship;
import com.passaregua.app.models.Usuario;
import com.passaregua.app.repositories.FriendshipRepository;
import com.passaregua.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Usuario> listFriends(String ownerEmail) {
        List<Friendship> fs = friendshipRepository.findByOwnerEmail(ownerEmail);
        return fs.stream()
                .map(f -> usuarioRepository.findByEmail(f.getFriendEmail()).orElse(null))
                .filter(u -> u != null)
                .toList();
    }

    public void addFriendshipBothSides(String aEmail, String bEmail) {
        if (!friendshipRepository.existsByOwnerEmailAndFriendEmail(aEmail, bEmail)) {
            friendshipRepository.save(Friendship.builder()
                    .ownerEmail(aEmail)
                    .friendEmail(bEmail)
                    .build());
        }
        if (!friendshipRepository.existsByOwnerEmailAndFriendEmail(bEmail, aEmail)) {
            friendshipRepository.save(Friendship.builder()
                    .ownerEmail(bEmail)
                    .friendEmail(aEmail)
                    .build());
        }
    }
    @Transactional
    public void removeFriendshipBothSides(String ownerEmail, String friendEmail) {
        friendshipRepository.deleteByOwnerEmailAndFriendEmail(ownerEmail, friendEmail);
        friendshipRepository.deleteByOwnerEmailAndFriendEmail(friendEmail, ownerEmail);
    }
}
