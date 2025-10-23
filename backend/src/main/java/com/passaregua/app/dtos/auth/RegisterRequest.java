package com.passaregua.app.dtos.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank(message = "Primeiro nome é obrigatório")
    @Size(max = 100, message = "Primeiro nome deve ter no máximo 100 caracteres")
    private String primeiroNome;

    @NotBlank(message = "Último nome é obrigatório")
    @Size(max = 100, message = "Último nome deve ter no máximo 100 caracteres")
    private String ultimoNome;

    // Pode ser email ou celular; mapeamos no backend
    @NotBlank(message = "Contato é obrigatório")
    @Size(max = 150, message = "Contato deve ter no máximo 150 caracteres")
    private String contato;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 4, max = 16, message = "Senha deve ter entre 4 e 16 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{4,}$",
        message = "Senha inválida. Regras: mínimo 4 caracteres, com pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial"
    )
    private String senha;

    // Front pode enviar valores nao padronizados; mapeamos internamente
    private String genero;

    @Min(value = 0, message = "Idade mínima é 0")
    @Max(value = 200, message = "Idade máxima é 200")
    private Integer idade;
}
