package com.lookout.Lookout.services

import com.sendgrid.*
import com.sendgrid.helpers.mail.Mail
import com.sendgrid.helpers.mail.objects.Content
import com.sendgrid.helpers.mail.objects.Email
import io.github.cdimascio.dotenv.Dotenv
import org.springframework.stereotype.Service
import java.io.IOException

@Service
class EmailService {
    fun sendEmail(toEmail: String?, subject: String?, content: String?): Boolean {
        val from: Email = Email("team.segfault.capstone@gmail.com", "Team Segfault") // Sender's email address
        val to: Email = Email(toEmail) // Recipient's email address
        val emailContent: Content = Content("text/plain", content)
        val mail: Mail = Mail(from, subject, to, emailContent)

        val sg: SendGrid = SendGrid(clientSecret)
        val request: Request = Request()
        try {
            request.setMethod(Method.POST)
            request.setEndpoint("mail/send")
            request.setBody(mail.build())
            val response: Response = sg.api(request)

            System.out.println(response.getStatusCode())
            System.out.println(response.getBody())
            System.out.println(response.getHeaders())

            return response.getStatusCode() === 202 // Return true if email is sent successfully
        } catch (ex: IOException) {
            ex.printStackTrace()
            return false
        }
    }

    companion object {
        val dotenv = Dotenv.configure()
            .directory("../backend/Lookout/.env")
            .load()

        private val clientSecret = dotenv["SENDGRID_API_KEY"]

    }
}
