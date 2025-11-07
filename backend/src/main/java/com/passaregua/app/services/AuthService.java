package com.passaregua.app.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.passaregua.app.dtos.auth.*;
import com.passaregua.app.models.*;
import com.passaregua.app.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class AuthService {

    private final UsuarioRepository repository;
    private final JavaMailSender mailSender;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public AuthService(UsuarioRepository repository, JavaMailSender mailSender) {
        this.repository = repository;
        this.mailSender = mailSender;
    }

    public RegisterResponse register(RegisterRequest req) {
        // decidir se contato e email ou celular
        String contato = req.getContato();
        String email = null;
        String celular = null;
        if (contato.contains("@")) {
            email = contato.trim().toLowerCase();
        } else {
            celular = contato.trim();
        }

        if (email != null && repository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ja cadastrado");
        }

        Usuario u = new Usuario();
        u.setPrimeiroNome(req.getPrimeiroNome());
        u.setUltimoNome(req.getUltimoNome());
        u.setEmail(email);
        u.setCelular(celular);
        u.setSenha(req.getSenha());
        u.setHashSenha(hash(req.getSenha()));
        u.setGenero(mapGenero(req.getGenero()));
        u.setIdade(req.getIdade());
        u.setTwoFactorVerified(false);

        u = repository.save(u);
        return RegisterResponse.builder().usuarioId(u.getId()).build();
    }

    public void sendCode(SendCodeRequest req) {
        Usuario u = repository.findById(req.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));

        // Validar metodo escolhido com dados cadastrados
        if (req.getMethod() == TwoFactorMethod.EMAIL && (u.getEmail() == null || u.getEmail().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario nao tem email");
        }
        if (req.getMethod() == TwoFactorMethod.CELULAR && (u.getCelular() == null || u.getCelular().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario nao tem celular");
        }

        String code = generateCode(4);
        u.setTwoFactorMethod(req.getMethod());
        u.setTwoFactorCode(code);
        u.setTwoFactorExpiresAt(LocalDateTime.now().plusMinutes(10));
        u.setTwoFactorVerified(false);

        repository.save(u);

        // Enviar o código por email quando o método for EMAIL
        if (req.getMethod() == TwoFactorMethod.EMAIL) {
            try {
                sendVerificationEmail(u.getEmail(), code);
            } catch (Exception ex) {
                log.error("Falha ao enviar email de verificacao: {}", ex.getMessage(), ex);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha ao enviar email");
            }
        }
    }

    public void verifyCode(VerifyCodeRequest req) {
        Usuario u = repository.findById(req.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));

        if (u.getTwoFactorCode() == null || u.getTwoFactorExpiresAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codigo nao foi solicitado");
        }
        if (LocalDateTime.now().isAfter(u.getTwoFactorExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codigo expirado");
        }
        if (!u.getTwoFactorCode().equals(req.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codigo invalido");
        }

        u.setTwoFactorVerified(true);
        // opcional: limpar codigo
        u.setTwoFactorCode(null);
        u.setTwoFactorExpiresAt(null);
        repository.save(u);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) throws JsonProcessingException {
        Optional<Usuario> opt = repository.findByEmail(req.getEmail());
        Usuario u = opt.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais invalidas"));

        String reqHash = hash(req.getSenha());
        if (u.getHashSenha() == null || !u.getHashSenha().equals(reqHash)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais invalidas");
        }
        if (Boolean.FALSE.equals(u.getTwoFactorVerified())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "2FA pendente");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(MapperFeature.REQUIRE_HANDLERS_FOR_JAVA8_TIMES);

        String userObject = objectMapper.writeValueAsString(u);

        return LoginResponse.builder().message("Login efetuado").token(userObject).build();
    }

    private String hash(String senha) {
        if (senha == null) return null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(senha.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo de hash nao encontrado", e);
        }
    }

    private Genero mapGenero(String generoStr) {
        if (generoStr == null) return null;
        String g = generoStr.trim().toLowerCase();
        return switch (g) {
            case "masculino" -> Genero.MASCULINO;
            case "feminino" -> Genero.FEMININO;
            default -> Genero.PREFIRO_NAO_INFORMAR;
        };
    }

    private String generateCode(int digits) {
        Random r = new Random();
        int max = (int) Math.pow(10, digits) - 1;
        int num = r.nextInt(max + 1);
        return String.format("%0" + digits + "d", num);
    }

    private void sendVerificationEmail(String to, String code) {
        if (to == null || to.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email do usuario nao informado");
        }
        String from = (mailFrom == null || mailFrom.isBlank()) ? "no-reply@localhost" : mailFrom;
        String subject = "Seu código de verificação";
        String body = "Olá,\n\n" +
                "Use o código abaixo para verificar seu email no Passa Régua:\n\n" +
                code + "\n\n" +
                "O código expira em 10 minutos.\n\n" +
                "Se você não solicitou este código, ignore esta mensagem.";

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
  
    }
}
