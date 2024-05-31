package com.lookout.Lookout.constants

object ResponseConstant {

    // Response messages where the system could not do what was requested
    const val REQUIRED_PARAMETERS_NOT_SET = "The required parameters were not set."
    const val EVENT_CREATION_FAILED_INTERNAL_ERROR = "Internal Server Error - Event could no be created."
    const val EVENT_UPDATE_FAILED_INTERNAL_ERROR = "Internal Server Error - Event could not be updated."
    const val EVENT_DELETION_FAILED_INTERNAL_ERROR = "Internal Server Error - Event could not be deleted."
    const val SET_USER_CALENDAR_FAILED_INTERNAL_ERROR = "Internal Server Error - User calendar could not be set."
    const val INVALID_PARAMETERS = "Provided parameters invalid."
    const val GENERIC_INTERNAL_ERROR = "Internal Server Error - Something went wrong."
    const val UNAUTHORIZED = "Unauthorized request."
    const val INVALID_TOKEN = "Invalid token."
    const val USER_ALREADY_EXISTS = "User already exists."

}
