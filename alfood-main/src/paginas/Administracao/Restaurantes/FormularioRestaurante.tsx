import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../../../http';

export default function FormularioRestaurante() {
	const parametros = useParams();
	useEffect(() => {
		if (parametros.id) {
			http.get(`restaurantes/${parametros.id}/`).then((resposta) =>
				setNomeRestaurante(resposta.data.nome)
			);
		}
	}, [parametros]);

	const [nomeRestaurante, setNomeRestaurante] = useState('');

	const aoSumbeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
		evento.preventDefault();

		if (parametros.id) {
			http.put(`restaurantes/${parametros.id}/`, {
				nome: nomeRestaurante,
			}).then(() => alert('Restaurante atualizado com sucesso'));
		} else {
			http.post('restaurantes/', {
				nome: nomeRestaurante,
			}).then(() => alert('Restaurante cadastrado com sucesso'));
		}
		setNomeRestaurante('');
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					flexGrow: 1,
				}}>
				<Typography component="h1" variant="h6">
					Formulário de Restaurantes
				</Typography>
				<Box component="form" sx={{ width: '100%' }} onSubmit={aoSumbeterForm}>
					<TextField
						id="standard-basic"
						label="Nome do Restaurante"
						variant="standard"
						value={nomeRestaurante}
						onChange={(evento) => setNomeRestaurante(evento.target.value)}
						fullWidth
						required
					/>
					<Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>
						Salvar
					</Button>
				</Box>
			</Box>
		</>
	);
}
