module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // Nueva funcionalidad
				'fix', // Corrección de bug
				'docs', // Cambios en documentación
				'style', // Cambios de formato (no afectan el código)
				'refactor', // Refactorización de código
				'perf', // Mejoras de rendimiento
				'test', // Añadir o modificar tests
				'build', // Cambios en el sistema de build
				'ci', // Cambios en CI/CD
				'chore', // Otras tareas (actualizar deps, etc)
				'revert', // Revertir un commit
			],
		],
		'subject-case': [2, 'never', ['upper-case']], // No comenzar con mayúscula
		'header-max-length': [2, 'always', 100], // Máximo 100 caracteres
	},
};
