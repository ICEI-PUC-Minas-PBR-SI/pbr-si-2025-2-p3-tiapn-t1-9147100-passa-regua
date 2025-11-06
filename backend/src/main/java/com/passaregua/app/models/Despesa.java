package com.passaregua.app.models;

import com.passaregua.app.enums.StatusDespesa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "despesas")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDespesa;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grupo", nullable = false)
    private Group grupo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_criador", nullable = false)
    private Usuario criador;

     */
    @Column(name = "id_criador", nullable = false)
    private Long idCriador;

    @Column(name = "id_grupo", nullable = false)
    private Long idGrupo;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "comprovante_url", length = 255)
    private String comprovanteUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private StatusDespesa status = StatusDespesa.PENDENTE;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public Despesa() {}

    public Despesa(Group grupo, Usuario idCriador, String descricao, BigDecimal valor) {
        //this.grupo = grupo;
        //this.criador = criador;
        this.descricao = descricao;
        this.valor = valor;
    }

}
