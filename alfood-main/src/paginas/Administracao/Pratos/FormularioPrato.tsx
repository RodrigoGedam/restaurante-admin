import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import http from '../../../http';
import IRestaurante from '../../../interfaces/IRestaurante';
import ITag from '../../../interfaces/ITag';

export default function FormularioPrato() {
	const [nomePrato, setNomePrato] = useState('');
	const [descricao, setDescricao] = useState('');

	const [tag, setTag] = useState('');
	const [tags, setTags] = useState<ITag[]>([]);

	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
	const [restaurante, setRestaurante] = useState('');

	const [imagem, setImagem] = useState<File | null>(null);

	useEffect(() => {
		http.get<{ tags: ITag[] }>('tags/').then((resposta) => setTags(resposta.data.tags));
		http.get<IRestaurante[]>('restaurantes/').then((resposta) =>
			setRestaurantes(resposta.data)
		);
	});

	const selecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			setImagem(event.target.files[0]);
		} else {
			setImagem(null);
		}
	};

	const aoSumbeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
		evento.preventDefault();
		const formData = new FormData();

		formData.append('nome', nomePrato);
		formData.append('descricao', descricao);
		formData.append('tag', tag);
		formData.append('restaurante', restaurante);

		if (imagem) {
			formData.append('imagem', imagem);
		}

		http.request({
			url: 'pratos/',
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		})
			.then(() => {
				alert('Prato cadastrado com sucesso!');
				setNomePrato('');
				setDescricao('');
				setTag('');
				setRestaurante('');
			})
			.catch((erro) => console.log(erro));
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
					Formulário de Pratos
				</Typography>
				<Box component="form" sx={{ width: '100%' }} onSubmit={aoSumbeterForm}>
					<TextField
						id="standard-basic"
						label="Nome do Prato"
						variant="standard"
						value={nomePrato}
						onChange={(evento) => setNomePrato(evento.target.value)}
						fullWidth
						required
						margin="dense"
					/>
					<TextField
						id="standard-basic"
						label="Descrição"
						variant="standard"
						value={descricao}
						onChange={(evento) => setDescricao(evento.target.value)}
						fullWidth
						required
						margin="dense"
					/>
					<FormControl margin="dense" fullWidth>
						<InputLabel id="select-tag">Tag</InputLabel>
						<Select
							labelId="select-tag"
							value={tag}
							onChange={(event) => setTag(event.target.value)}>
							{tags.map((tag) => (
								<MenuItem key={tag.id} value={tag.value}>
									{tag.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl margin="dense" fullWidth>
						<InputLabel id="select-restaurante">Restaurante</InputLabel>
						<Select
							labelId="select-restaurante"
							value={restaurante}
							onChange={(event) => setRestaurante(event.target.value)}>
							{restaurantes.map((restaurante) => (
								<MenuItem key={restaurante.id} value={restaurante.id}>
									{restaurante.nome}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<input type="file" onChange={selecionarArquivo} />
					<Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>
						Salvar
					</Button>
				</Box>
			</Box>
		</>
	);
}
