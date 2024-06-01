package com.lookout.Lookout

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class LookoutApplication

fun main(args: Array<String>) {
	runApplication<LookoutApplication>(*args)
}
