class LoggerController{
  async getLogs(req,res){
        try {
            req.logger.debug("Mensaje de debug");
            req.logger.http("Mensaje de http");
            req.logger.info("Mensaje de info");
            req.logger.warn("Mensaje de warn");
            req.logger.error("Mensaje de error");
            req.logger.fatal("Mensaje de fatal");
            return res.send("Log Generado");
        } catch (error) {
            res.status(500).json({error: "Error interno del servidor", reason: error.message});
        }
    }
}

export default LoggerController;