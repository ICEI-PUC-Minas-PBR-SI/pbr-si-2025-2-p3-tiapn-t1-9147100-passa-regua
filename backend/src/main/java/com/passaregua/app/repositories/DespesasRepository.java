package com.passaregua.app.repositories;

import com.passaregua.app.models.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DespesasRepository extends JpaRepository<Despesa, Long> {
    List<Despesa> findByIdGrupo(Long grupo_id);

    List<Despesa> findByIdCriador(Long criador);

    List<Despesa> findByStatus(String status);
}
