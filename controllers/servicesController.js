import servicesDao from "../model/services.dao.js";
import clientsDao from "../model/clients.dao.js";
import UserDao from "../model/users.dao.js";
import lastServiceRegister from "../model/lastServiceRegister.dao.js";
import {
  schemaServicesCreate,
  schemaServicesUpdate,
  schemaServicesStatusCreate,
  schemaServicesStatusDelete,
} from "../services/validate.js";

/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna el listado de servicios.
 *
 * @param {*} req
 * @param {*} res
 */
function viewAlls(req, res) {
  console.log("[Servicios -> viewAlls]");
  servicesDao
    .find()
    .then(async (services) => {
      const Clients = await clientsDao.find();
      services.map((service) => {
        Clients.map((client) => {
          if (client._id.toString() === service.client_id) {
            service.client = client;
          }
        });
      });
      const Users = await UserDao.find();
      services.map((service) => {
        Users.map((user) => {
          if (user._id.toString() === service.user_id) {
            service.user = user;
            service.user.password = null;
          }
        });
      });
      res.status(200).json(services);
    })
    .catch((err) => {
      console.log("[Error] ", err);
      res.status(500).json({ err: 500, status: "error", msg: err.msg });
    });
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna un objeto de estadisticas.
 *
 * @param {*} req
 * @param {*} res
 */
function viewStatistics(req, res) {
  console.log("[Servicios -> viewStatistics]");
  servicesDao
    .find()
    .then(async (services) => {
      const statistics = {
        recepcionado: 0,
        revisado: 0,
        sin_reparacion: 0,
        reparado: 0,
        devuelto: 0,
      };
      services.map((service) => {
        switch (service.state) {
          case "Recepcionado":
            statistics.recepcionado += 1;
            break;
          case "Revisado":
            statistics.revisado += 1;
            break;
          case "Sin reparación":
            statistics.sin_reparacion += 1;
            break;
          case "Reparado":
            statistics.reparado += 1;
            break;
          case "Devuelto":
            statistics.devuelto += 1;
            break;
        }
      });
      res.status(200).json(statistics);
    })
    .catch((err) => {
      console.log("[Error] ", err);
      res.status(500).json({ err: 500, msg: err.msg });
    });
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un servicio especifico según su id.
 *
 * @param {*} req
 * @param {*} res
 */
function viewId(req, res) {
  servicesDao
    .findById(req.params.id)
    .then(async (service) => {
      service.client = await clientsDao.findById(service.client_id);
      service.user = await UserDao.findById(service.user_id);
      res.status(200).json(service);
    })
    .catch((err) => {
      console.log("[Error] ", err);
      res.status(500).json({ error: 500, status: "error", msg: err.msg });
    });
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna ultimos servicios.
 *
 * @param {*} req
 * @param {*} res
 */
function viewRecent(req, res) {
  console.log("[Service] Servicios recientes.");
  servicesDao
    .findRecent(parseInt(req.params.cant))
    .then(async (services) => {
      const Clients = await clientsDao.find();
      services.map((service) => {
        Clients.map((client) => {
          if (client._id.toString() === service.client_id) {
            service.client = client;
          }
        });
      });
      const Users = await UserDao.find();
      services.map((service) => {
        Users.map((user) => {
          if (user._id.toString() === service.user_id) {
            service.user = user;
            service.user.password = null;
          }
        });
      });
      res.status(200).json(services);
    })
    .catch((err) => {
      console.log("[Error] ", err);
      res.status(500).json({ err: 500, status: "error", msg: err.msg });
    });
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Crea un nuevo servicio y lo vincula con el usario.
 *
 * @param {*} req
 * @param {*} res
 */
function create(req, res) {
  schemaServicesCreate
    .validate(req.body)
    .then(async (entity) => {
      entity.state = "Recepcionado";
      entity.create_at = new Date();
      entity.states = {
        Recepcionado: { date: new Date(), description: entity.description },
      };
      entity.user_id = req.user._id.toString();
      entity.softDelete = false;
      await lastServiceRegister.update();
      entity.service_id = await lastServiceRegister.find();
      servicesDao
        .insert(entity)
        .then((entityInsert) => {
          clientsDao
            .addService(entity.client_id, entityInsert.insertedId.toString())
            .then(() => {
              res.status(200).json({
                status: "success",
                msg: "El servicio fue creado correctamente.",
              });
            })
            .catch((err) => {
              console.log("[Error] ", err);
              res
                .status(500)
                .json({ error: 500, status: "error", msg: err.msg });
            });
        })
        .catch((err) => {
          console.log("[Error] ", err);
          res.status(500).json({ error: 500, status: "error", msg: err.msg });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: 500,
        msg: "Error al validar",
        status: "error",
        validateError: err.errors,
      });
    });
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Modifica los datos del servicio.
 *
 * @param {*} req
 * @param {*} res
 */
function update(req, res) {
  schemaServicesUpdate
    .validate(req.body)
    .then(async (entity) => {
      servicesDao
        .update(req.params.id, entity)
        .then((data) => {
          res.status(200).json({
            status: "success",
            msg: "El servicio fue modificado correctamente.",
          });
        })
        .catch((err) => {
          console.log("[Error] ", err);
          res.status(500).json({ error: 500, status: "error", msg: err.msg });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: 500,
        status: "error",
        msg: err.errors,
      });
    });
}

/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un servicio según su id y los registros del cliente.
 *
 * @param {*} req
 * @param {*} res
 */
export function deleteEntity(req, res) {
  servicesDao
    .findById(req.params.id)
    .then(async (service) => {
      clientsDao
        .deleteService(service.client_id, service._id.toString())
        .then(() => {
          servicesDao
            .deleteEntity(req.params.id)
            .then((service) => {
              res.status(200).json({
                status: "success",
                msg: "El servicio fue eliminado correctamente.",
              });
            })
            .catch((err) => {
              console.log("[Error] ", err);
              res
                .status(500)
                .json({ error: 500, status: "error", msg: err.msg });
            });
        })
        .catch((err) => {
          console.log("[Error] ", err);
          res.status(500).json({ error: 500, status: "error", msg: err.msg });
        });
    })
    .catch((err) => {
      console.log("[Error] ", err);
      res.status(500).json({ error: 500, status: "error", msg: err.msg });
    });
}
/*-------------------------------------------------------------------------------------------*/

async function statusCreate(req, res) {
  try {
    const oldEntity = await servicesDao.findById(req.params.id);
    const entity = await schemaServicesStatusCreate.validate(req.body);

    const validTransitions = {
      Recepcionado: ["Revisado", "Sin reparación", "Devuelto"],
      Revisado: ["Reparado", "Devuelto"],
      Reparado: ["Devuelto"],
      "Sin reparación": ["Devuelto"],
      Devuelto: [], // Estado final, no permite transiciones
    };

    // Obtener el estado actual del servicio
    const currentState = Object.keys(oldEntity.states).pop();

    // Verificar que la transición al nuevo estado es válida
    if (!validTransitions[currentState].includes(entity.state)) {
      return res.status(400).json({
        error: 400,
        status: "error",
        msg: `Transición de estado no válida de ${currentState} a ${entity.state}`,
      });
    }

    // Actualizar los estados manteniendo los anteriores
    const updatedStates = {
      ...oldEntity.states,
      [entity.state]: {
        date: new Date(),
        description: entity.description,
      },
    };

    // Asignar la fecha actual y los estados actualizados
    entity.date = new Date();
    entity.states = updatedStates;

    // Actualizar el servicio en la base de datos
    await servicesDao.update(req.params.id, entity);

    // Responder con éxito
    res.status(200).json({
      status: "success",
      msg: "El servicio fue modificado correctamente.",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: 400, status: "error", msg: err.errors });
    } else {
      console.log("[Error] ", err);
      res.status(500).json({ error: 500, status: "error", msg: err.message });
    }
  }
}

/*-------------------------------------------------------------------------------------------*/

async function statusDelete(req, res) {
  try {
    // Validar la solicitud
    const bodyValidate = await schemaServicesStatusDelete.validate(req.body);
    const { state: stateToDelete } = bodyValidate;
    const { id } = req.params;

    // Buscar el servicio por ID
    const oldEntity = await servicesDao.findById(id);

    // Verificar que el estado a eliminar no sea "Recepcionado"
    if (stateToDelete === "Recepcionado") {
      return res.status(400).json({
        error: 400,
        status: "error",
        msg: "No se puede eliminar el estado inicial Recepcionado.",
      });
    }

    // Obtener los estados actuales del servicio
    const currentStates = oldEntity.states;
    const stateKeys = Object.keys(currentStates);

    // Verificar que el estado a eliminar no sea un estado intermedio
    const stateIndex = stateKeys.indexOf(stateToDelete);
    if (stateIndex !== -1 && stateIndex !== stateKeys.length - 1) {
      return res.status(400).json({
        error: 400,
        status: "error",
        msg: "No se puede eliminar un estado intermedio.",
      });
    }

    // Eliminar el estado
    delete currentStates[stateToDelete];

    const updatedStateKeys = Object.keys(currentStates);
    const lastState =
      updatedStateKeys.length > 0
        ? updatedStateKeys[updatedStateKeys.length - 1]
        : null;
    // Actualizar los estados en la base de datos
    await servicesDao.update(id, { states: currentStates, state: lastState });

    // Responder con éxito
    res.status(200).json({
      status: "success",
      msg: "El estado fue eliminado correctamente.",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: 400, status: "error", msg: err.errors });
    } else {
      console.log("[Error] ", err);
      res.status(500).json({ error: 500, status: "error", msg: err.message });
    }
  }
}

/*-------------------------------------------------------------------------------------------*/

function statusUpdate(req, res) {}

/*-------------------------------------------------------------------------------------------*/

export default {
  viewAlls,
  viewId,
  viewStatistics,
  viewRecent,
  create,
  update,
  deleteEntity,
  statusCreate,
  statusDelete,
  statusUpdate,
};
