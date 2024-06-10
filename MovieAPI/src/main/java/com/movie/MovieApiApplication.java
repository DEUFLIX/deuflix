package com.movie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@SpringBootApplication
public class MovieApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieApiApplication.class, args);
        startNodeServer();
    }

    private static void startNodeServer() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("node", "C:/Users/dita/IdeaProjects/deuflix2/server.js");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            System.out.println("Node.js 서버가 시작되었습니다.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
