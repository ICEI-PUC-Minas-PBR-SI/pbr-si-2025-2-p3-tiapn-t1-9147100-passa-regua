package com.passaregua.app.services;

import com.passaregua.app.models.Despesa;
import com.passaregua.app.enums.StatusDespesa;
import com.passaregua.app.models.Notification;
import com.passaregua.app.repositories.DespesasRepository;
import com.passaregua.app.repositories.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DespesasService {

    private final UsuarioService usuarioService;
    private final DespesasRepository despesasRepository;
    private final NotificationRepository notificationRepository;

    public DespesasService(UsuarioService usuarioService, DespesasRepository despesasRepository, NotificationRepository notificationRepository) {
        this.usuarioService = usuarioService;
        this.despesasRepository = despesasRepository;
        this.notificationRepository = notificationRepository;
    }

    // -----------------------------------------------------
    // CRUD Básico
    // -----------------------------------------------------

    public List<Despesa> listarTodas() {
        return despesasRepository.findAll();
    }

    public Optional<Despesa> buscarPorId(Long id) {
        return despesasRepository.findById(id);
    }

    public List<Despesa> listarPorGrupo(Long grupo_id) {
        return despesasRepository.findByIdGrupo(grupo_id);
    }

    public List<Despesa> listarPorCriador(long criador) {
        return despesasRepository.findByIdCriador(criador);
    }

    @Transactional
    public Despesa salvar(Despesa despesa) {
        var despesaSalva = despesasRepository.save(despesa);
        var nomeCadastrante = despesa.getNomeCadastrante();
        for (int i = 0; i < despesa.getOutrosMembros().size(); i++) {
            var outros = despesa.getOutrosMembros().get(i);
            notificationRepository.save(new Notification(outros, "CRIACAO_DESPESA", nomeCadastrante + " criou nova despesa", "Nova despesa criada - Descrição: " + despesa.getDescricao() + " Valor: " + despesa.getValor(), despesa.getIdGrupo(), despesa.getEmailCadastrante()));
        }
        return despesaSalva;
    }

    @Transactional
    public Despesa atualizarStatus(Long idDespesa, StatusDespesa novoStatus) {
        Despesa despesa = despesasRepository.findById(idDespesa)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
        despesa.setStatus(novoStatus);
        return despesasRepository.save(despesa);
    }

    @Transactional
    public void deletar(Long id) {
        if (!despesasRepository.existsById(id)) {
            throw new RuntimeException("Despesa não encontrada");
        }
        despesasRepository.deleteById(id);
    }

    // -----------------------------------------------------
    // Regras de negócio adicionais
    // -----------------------------------------------------

    public List<Despesa> listarPendentes() {
        return despesasRepository.findByStatus(StatusDespesa.PENDENTE.name());
    }

    public Despesa validarDespesa(Long id) {
        return atualizarStatus(id, StatusDespesa.VALIDADA);
    }

    public Despesa marcarComoAbatida(Long id) {
        return atualizarStatus(id, StatusDespesa.ABATIDA);
    }
}