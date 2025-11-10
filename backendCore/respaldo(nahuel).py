from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy import or_
import re

app = Flask(__name__)

# Configuración CORS - permite peticiones desde cualquier origen
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///peluqueria.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ==================== MODELOS ====================

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(15), nullable=False)
    apellido = db.Column(db.String(15), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    correo = db.Column(db.String(50), nullable=False)
    
    # Relaciones
    mascotas = db.relationship('Mascota', backref='cliente', cascade='all, delete-orphan', lazy=True)
    turnos = db.relationship('Turno', backref='cliente', cascade='all, delete-orphan', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'telefono': self.telefono,
            'correo': self.correo,
            'mascotas': [m.to_dict() for m in self.mascotas]
        }


class Mascota(db.Model):
    __tablename__ = 'mascotas'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(15), nullable=False)
    tipo = db.Column(db.String(10), nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'cliente_id': self.cliente_id
        }


class Turno(db.Model):
    __tablename__ = 'turnos'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)
    mascota_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'), nullable=True)
    
    mascota = db.relationship('Mascota', backref='turnos')
    
    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'fecha': self.fecha.strftime('%Y-%m-%d'),
            'hora': self.hora.strftime('%H:%M'),
            'mascota_id': self.mascota_id
        }


# ==================== UTILIDADES ====================

def validar_email(email):
    patron = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(patron, email) is not None


# ==================== RUTAS - ABM CLIENTES ====================

@app.route('/clientes', methods=['POST'])
def crear_cliente():
    """Crear un nuevo cliente"""
    data = request.get_json()
    
    # Validaciones
    if not all(k in data for k in ['nombre', 'apellido', 'telefono', 'correo']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    if not validar_email(data['correo']):
        return jsonify({'error': 'Email inválido'}), 400
    
    try:
        cliente = Cliente(
            nombre=data['nombre'],
            apellido=data['apellido'],
            telefono=data['telefono'],
            correo=data['correo']
        )
        db.session.add(cliente)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Cliente creado exitosamente',
            'cliente': cliente.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/clientes/<int:cliente_id>', methods=['GET'])
def buscar_cliente_por_id(cliente_id):
    """Buscar cliente por ID"""
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
    return jsonify(cliente.to_dict()), 200


@app.route('/clientes', methods=['GET'])
def listar_clientes():
    """Listar todos los clientes"""
    clientes = Cliente.query.all()
    return jsonify([c.to_dict() for c in clientes]), 200


@app.route('/clientes/buscar', methods=['GET'])
def buscar_clientes():
    """Buscar clientes por nombre o mascota"""
    nombre = request.args.get('nombre')
    mascota = request.args.get('mascota')
    
    if nombre is not None:  # Permite búsqueda vacía para listar todos
        if nombre == '':
            clientes = Cliente.query.all()
        else:
            clientes = Cliente.query.filter(
                or_(
                    Cliente.nombre.ilike(f'%{nombre}%'),
                    Cliente.apellido.ilike(f'%{nombre}%')
                )
            ).all()
    elif mascota:
        clientes = Cliente.query.join(Mascota).filter(
            Mascota.nombre.ilike(f'%{mascota}%')
        ).all()
    else:
        return jsonify({'error': 'Debe proporcionar nombre o mascota'}), 400
    
    return jsonify([c.to_dict() for c in clientes]), 200


@app.route('/clientes/<int:cliente_id>', methods=['PUT'])
def modificar_cliente(cliente_id):
    """Modificar datos del cliente (teléfono, correo)"""
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
    data = request.get_json()
    
    try:
        if 'telefono' in data:
            cliente.telefono = data['telefono']
        if 'correo' in data:
            if not validar_email(data['correo']):
                return jsonify({'error': 'Email inválido'}), 400
            cliente.correo = data['correo']
        
        db.session.commit()
        return jsonify({
            'mensaje': 'Cliente actualizado exitosamente',
            'cliente': cliente.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def eliminar_cliente(cliente_id):
    """Eliminar cliente y sus mascotas relacionadas"""
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
    try:
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'mensaje': 'Cliente eliminado exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== RUTAS - MASCOTAS ====================

@app.route('/clientes/<int:cliente_id>/mascotas', methods=['POST'])
def agregar_mascota(cliente_id):
    """Agregar mascota a un cliente"""
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
    data = request.get_json()
    
    if not all(k in data for k in ['nombre', 'tipo']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    try:
        mascota = Mascota(
            nombre=data['nombre'],
            tipo=data['tipo'],
            cliente_id=cliente_id
        )
        db.session.add(mascota)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Mascota agregada exitosamente',
            'mascota': mascota.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== RUTAS - TURNOS ====================

@app.route('/turnos', methods=['POST'])
def agendar_turno():
    """Agendar un nuevo turno"""
    data = request.get_json()
    
    if not all(k in data for k in ['cliente_id', 'fecha', 'hora']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Verificar que el cliente existe
    cliente = Cliente.query.get(data['cliente_id'])
    if not cliente:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
    try:
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%d').date()
        hora = datetime.strptime(data['hora'], '%H:%M').time()
        
        # Verificar que no exista otro turno en la misma fecha y hora
        turno_existente = Turno.query.filter_by(fecha=fecha, hora=hora).first()
        if turno_existente:
            return jsonify({'error': 'Ya existe un turno para esa fecha y hora'}), 409
        
        turno = Turno(
            cliente_id=data['cliente_id'],
            fecha=fecha,
            hora=hora,
            mascota_id=data.get('mascota_id')
        )
        db.session.add(turno)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Turno agendado exitosamente',
            'turno': turno.to_dict()
        }), 201
    except ValueError:
        return jsonify({'error': 'Formato de fecha u hora inválido'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/turnos/dia/<fecha>', methods=['GET'])
def consultar_turnos_dia(fecha):
    """Consultar turnos de un día específico"""
    try:
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        turnos = Turno.query.filter_by(fecha=fecha_obj).order_by(Turno.hora).all()
        
        resultado = []
        for turno in turnos:
            cliente = turno.cliente
            mascota = turno.mascota
            resultado.append({
                'id': turno.id,
                'dia': turno.fecha.strftime('%Y-%m-%d'),
                'hora': turno.hora.strftime('%H:%M'),
                'cliente_nombre': f"{cliente.nombre} {cliente.apellido}",
                'cliente_mascota': mascota.nombre if mascota else 'N/A',
                'correo': cliente.correo,
                'numero': cliente.telefono
            })
        
        return jsonify(resultado), 200
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido'}), 400


@app.route('/turnos/semana', methods=['GET'])
def consultar_turnos_semana():
    """Consultar turnos de la semana actual"""
    fecha_inicio = request.args.get('fecha_inicio')
    
    if fecha_inicio:
        fecha_inicio_obj = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
    else:
        fecha_inicio_obj = datetime.now().date()
    
    fecha_fin_obj = fecha_inicio_obj + timedelta(days=7)
    
    turnos = Turno.query.filter(
        Turno.fecha >= fecha_inicio_obj,
        Turno.fecha < fecha_fin_obj
    ).order_by(Turno.fecha, Turno.hora).all()
    
    resultado = []
    for turno in turnos:
        cliente = turno.cliente
        mascota = turno.mascota
        resultado.append({
            'id': turno.id,
            'dia': turno.fecha.strftime('%Y-%m-%d'),
            'hora': turno.hora.strftime('%H:%M'),
            'cliente_nombre': f"{cliente.nombre} {cliente.apellido}",
            'cliente_mascota': mascota.nombre if mascota else 'N/A',
            'correo': cliente.correo,
            'numero': cliente.telefono
        })
    
    return jsonify(resultado), 200


@app.route('/turnos/<int:turno_id>', methods=['DELETE'])
def cancelar_turno(turno_id):
    """Cancelar un turno"""
    turno = Turno.query.get(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    
    try:
        db.session.delete(turno)
        db.session.commit()
        return jsonify({'mensaje': 'Turno cancelado exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== NOTIFICACIONES ====================

@app.route('/notificaciones/manana', methods=['GET'])
def obtener_turnos_manana():
    """Obtener turnos para el día siguiente (para enviar notificaciones)"""
    fecha_manana = datetime.now().date() + timedelta(days=1)
    
    turnos = Turno.query.filter_by(fecha=fecha_manana).all()
    
    notificaciones = []
    for turno in turnos:
        cliente = turno.cliente
        mascota = turno.mascota
        notificaciones.append({
            'cliente_nombre': f"{cliente.nombre} {cliente.apellido}",
            'correo': cliente.correo,
            'telefono': cliente.telefono,
            'fecha': turno.fecha.strftime('%Y-%m-%d'),
            'hora': turno.hora.strftime('%H:%M'),
            'mascota': mascota.nombre if mascota else 'N/A'
        })
    
    return jsonify(notificaciones), 200

# ==================== INICIALIZACIÓN ====================

@app.route('/init', methods=['POST'])
def inicializar_db():
    """Inicializar la base de datos (solo para desarrollo)"""
    try:
        db.drop_all()
        db.create_all()
        return jsonify({'mensaje': 'Base de datos inicializada exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def inicio():
    """Ruta de bienvenida"""
    return jsonify({
        'mensaje': 'API Sistema de Reservas - Peluquería de Mascotas',
        'version': '1.0',
        'endpoints': {
            'clientes': '/clientes',
            'turnos': '/turnos',
            'notificaciones': '/notificaciones/manana'
        }
    }), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)