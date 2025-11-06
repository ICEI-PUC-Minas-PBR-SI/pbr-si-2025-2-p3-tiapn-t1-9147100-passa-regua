package com.passaregua.app.controllers;

import com.passaregua.app.enums.StatusDespesa;
import com.passaregua.app.models.Despesa;
import com.passaregua.app.models.Group;
import com.passaregua.app.models.Usuario;
import com.passaregua.app.services.DespesasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/despesas")
public class DespesasController {

    private final DespesasService despesasService;

    public DespesasController(DespesasService despesasService) {
        this.despesasService = despesasService;
    }

    @GetMapping
    public ResponseEntity<List<Despesa>> listarTodas() {
        return ResponseEntity.ok(despesasService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        return despesasService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/grupo/{idGrupo}")
    public ResponseEntity<List<Despesa>> listarPorGrupo(@PathVariable Long idGrupo) {
        return ResponseEntity.ok(despesasService.listarPorGrupo(idGrupo));
    }

    @GetMapping("/criador/{idUsuario}")
    public ResponseEntity<List<Despesa>> listarPorCriador(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(despesasService.listarPorCriador(idUsuario));
    }

    @PostMapping
    public ResponseEntity<Despesa> criar(@RequestBody Despesa despesa) {
        Despesa nova = despesasService.salvar(despesa);
        return ResponseEntity.ok(nova);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Despesa> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusDespesa status
    ) {
        Despesa atualizada = despesasService.atualizarStatus(id, status);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        despesasService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Despesa> validarDespesa(@PathVariable Long id) {
        Despesa despesa = despesasService.validarDespesa(id);
        return ResponseEntity.ok(despesa);
    }

    @PutMapping("/{id}/abater")
    public ResponseEntity<Despesa> abaterDespesa(@PathVariable Long id) {
        Despesa despesa = despesasService.marcarComoAbatida(id);
        return ResponseEntity.ok(despesa);
    }
}
