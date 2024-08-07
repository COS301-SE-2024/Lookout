package com.lookout.Lookout

import io.github.cdimascio.dotenv.Dotenv
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class LookoutApplication

fun main(args: Array<String>) {
	val dotenv = Dotenv.configure()
		.directory("../backend/Lookout/.env")
		.load()
	dotenv["DB_URL"]?.let { System.setProperty("DB_URL", it) }
//	dotenv["DB_USER"]?.let { System.setProperty("DB_USER", it) }
//	dotenv["DB_PASS"]?.let { System.setProperty("DB_PASS", it) }
	runApplication<LookoutApplication>(*args)
}

