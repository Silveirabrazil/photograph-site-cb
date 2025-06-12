import os
from PIL import Image
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

# --- Presets de Otimização ---
OPTIMIZATION_PRESETS = {
    "Web Geral": {"max_width": 1600, "jpeg_quality": 80, "png_optimize": True, "output_format": "webp"},
    "Alta Qualidade Web": {"max_width": 1920, "jpeg_quality": 90, "png_optimize": True, "output_format": "webp"},
    "Miniaturas/Thumbnails": {"max_width": 400, "jpeg_quality": 70, "png_optimize": True, "output_format": "jpeg"},
    "Redes Sociais": {"max_width": 1200, "jpeg_quality": 85, "png_optimize": True, "output_format": "jpeg"},
    "Original (apenas otimizar)": {"max_width": 0, "jpeg_quality": 95, "png_optimize": True, "output_format": "webp"}, # 0 para não redimensionar
}

# Formatos de imagem suportados para leitura pela Pillow
SUPPORTED_IMAGE_FORMATS = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp')
# Formatos RAW comuns (Pillow não lida diretamente)
RAW_FORMATS = ('.cr2', '.nef', '.arw', '.orf', '.rw2', '.dng', '.raf', '.pef', '.xmp')

# --- Função de Otimização de Imagens ---
def optimize_images_for_web(input_folder, output_folder, max_width, jpeg_quality, png_optimize,
                            output_format_choice, batch_rename_prefix, delete_original_images, log_area):
    """
    Otimiza imagens para a web em massa, com feedback para uma área de log,
    incluindo escolha de formato de saída, renomeação em lote e exclusão de originais.
    """
    log_area.insert(tk.END, f"Iniciando otimização de imagens de '{input_folder}' para '{output_folder}'...\n")
    log_area.insert(tk.END, f"Opções: Largura Máx={max_width if max_width else 'N/A'}, Qualidade JPEG/WebP={jpeg_quality}, Otimizar PNG={png_optimize}, Formato Saída={output_format_choice.upper()}\n")
    if batch_rename_prefix:
        log_area.insert(tk.END, f"Renomeação em lote: Prefixo='{batch_rename_prefix}'\n")
    if delete_original_images:
        log_area.insert(tk.END, "ATENÇÃO: IMAGENS ORIGINAIS SERÃO APAGADAS APÓS O PROCESSAMENTO BEM-SUCEDIDO!\n")
    log_area.see(tk.END)

    os.makedirs(output_folder, exist_ok=True)

    processed_count = 0
    error_count = 0
    deleted_count = 0
    raw_found_count = 0
    file_index = 1

    for root, _, files in os.walk(input_folder):
        relative_path = os.path.relpath(root, input_folder)
        current_output_folder = os.path.join(output_folder, relative_path)
        os.makedirs(current_output_folder, exist_ok=True)

        files_to_process = []
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in SUPPORTED_IMAGE_FORMATS:
                files_to_process.append(f)
            elif ext in RAW_FORMATS:
                log_area.insert(tk.END, f"AVISO: Arquivo RAW '{f}' encontrado. Por favor, processe arquivos RAW com software especializado antes de otimizar para web.\n")
                raw_found_count += 1
                log_area.see(tk.END)
        
        image_files = sorted(files_to_process)


        for filename in image_files:
            input_filepath = os.path.join(root, filename)
            base_name, ext = os.path.splitext(filename)

            try:
                with Image.open(input_filepath) as img:
                    original_size_mb = os.path.getsize(input_filepath) / (1024 * 1024)
                    log_area.insert(tk.END, f"Processando: {filename} (Original: {original_size_mb:.2f} MB)\n")
                    log_area.see(tk.END)

                    if img.mode == 'RGBA' and output_format_choice.lower() == 'jpeg':
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3])
                        img = background
                        log_area.insert(tk.END, " - Convertendo RGBA para RGB (fundo branco para JPEG).\n")
                        log_area.see(tk.END)
                    elif img.mode == 'P' and 'transparency' in img.info and output_format_choice.lower() == 'jpeg':
                        img = img.convert('RGBA')
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3])
                        img = background
                        log_area.insert(tk.END, " - Convertendo PNG P+Alfa para RGB (fundo branco para JPEG).\n")
                        log_area.see(tk.END)
                    elif img.mode == 'P' and output_format_choice.lower() in ('jpeg', 'webp', 'png'):
                        if output_format_choice.lower() == 'png' or output_format_choice.lower() == 'webp':
                            img = img.convert('RGBA')
                        else:
                            img = img.convert('RGB')
                        log_area.insert(tk.END, " - Convertendo PNG P para RGB/RGBA.\n")
                        log_area.see(tk.END)
                    elif img.mode not in ('RGB', 'RGBA') and output_format_choice.lower() in ('jpeg', 'webp', 'png'):
                        img = img.convert('RGB')
                        log_area.insert(tk.END, f" - Convertendo {img.mode} para RGB.\n")
                        log_area.see(tk.END)

                    if max_width is not None and max_width > 0 and img.width > max_width:
                        width_percent = (max_width / float(img.size[0]))
                        height_size = int((float(img.size[1]) * float(width_percent)))
                        img = img.resize((max_width, height_size), Image.LANCZOS)
                        log_area.insert(tk.END, f" - Redimensionado para {img.width}x{img.height}.\n")
                        log_area.see(tk.END)

                    output_format_pil = output_format_choice.upper()
                    output_ext = f".{output_format_choice.lower()}"
                    save_kwargs = {}

                    if output_format_pil == 'JPEG':
                        save_kwargs = {'quality': jpeg_quality, 'optimize': True}
                    elif output_format_pil == 'PNG':
                        save_kwargs = {'optimize': png_optimize}
                    elif output_format_pil == 'WEBP':
                        save_kwargs = {'quality': jpeg_quality, 'lossless': False}
                        if img.mode == 'RGBA':
                            save_kwargs['exact'] = True
                    else:
                        output_format_pil = 'JPEG'
                        output_ext = '.jpeg'
                        save_kwargs = {'quality': jpeg_quality, 'optimize': True}
                        log_area.insert(tk.END, f" - Formato de saída '{output_format_choice}' desconhecido ou inválido. Usando JPEG como fallback.\n")


                    if batch_rename_prefix:
                        new_base_name = f"{batch_rename_prefix}{file_index:03d}"
                        file_index += 1
                    else:
                        new_base_name = base_name

                    output_filename = f"{new_base_name}{output_ext}"
                    output_filepath = os.path.join(current_output_folder, output_filename)

                    img.save(output_filepath, format=output_format_pil, **save_kwargs)
                    optimized_size_mb = os.path.getsize(output_filepath) / (1024 * 1024)
                    log_area.insert(tk.END, f" - Salvo como: {output_filename} (Otimizado: {optimized_size_mb:.2f} MB)\n")
                    log_area.see(tk.END)
                    processed_count += 1

                    if delete_original_images:
                        try:
                            os.remove(input_filepath)
                            log_area.insert(tk.END, f" - Original '{filename}' apagado.\n")
                            deleted_count += 1
                        except Exception as delete_e:
                            log_area.insert(tk.END, f" - Erro ao apagar original '{filename}': {delete_e}\n")
                        finally:
                            log_area.see(tk.END)
                    log_area.insert(tk.END, "\n")

            except Exception as e:
                log_area.insert(tk.END, f"Erro ao processar a imagem '{filename}': {e}\n\n")
                log_area.see(tk.END)
                error_count += 1

    final_message = f"Otimização de imagens concluída!\nProcessados: {processed_count}, Erros: {error_count}, Apagados: {deleted_count}"
    if raw_found_count > 0:
        final_message += f"\n\nAVISO: {raw_found_count} arquivo(s) RAW encontrado(s) e ignorado(s). Eles precisam ser processados por software especializado."

    log_area.insert(tk.END, final_message + "\n")
    log_area.see(tk.END)
    messagebox.showinfo("Otimização Concluída", final_message)

# --- Função: Apenas Renomear Imagens Existentes ---
def rename_existing_images(input_folder, batch_rename_prefix, log_area):
    """
    Renomeia imagens existentes na pasta de entrada sem otimizá-las.
    """
    log_area.insert(tk.END, f"Iniciando renomeação de imagens em '{input_folder}' com o prefixo '{batch_rename_prefix}'...\n")
    log_area.see(tk.END)

    if not batch_rename_prefix:
        log_area.insert(tk.END, "ERRO: Prefixo de renomeação em lote não fornecido. Abortando.\n")
        messagebox.showerror("Erro de Renomeação", "Por favor, digite um prefixo para a renomeação em lote.")
        return

    renamed_count = 0
    error_count = 0
    file_index = 1

    for root, _, files in os.walk(input_folder):
        image_files = sorted([f for f in files if os.path.splitext(f)[1].lower() in SUPPORTED_IMAGE_FORMATS])

        for filename in image_files:
            original_filepath = os.path.join(root, filename)
            base_name, ext = os.path.splitext(filename)

            try:
                new_base_name = f"{batch_rename_prefix}{file_index:03d}"
                new_filename = f"{new_base_name}{ext}"
                new_filepath = os.path.join(root, new_filename)

                if original_filepath != new_filepath:
                    os.rename(original_filepath, new_filepath)
                    log_area.insert(tk.END, f"Renomeado: '{filename}' para '{new_filename}'\n")
                    renamed_count += 1
                else:
                    log_area.insert(tk.END, f"Arquivo '{filename}' já tem o nome correto. Pulando.\n")
                
                log_area.see(tk.END)
                file_index += 1

            except Exception as e:
                log_area.insert(tk.END, f"Erro ao renomear '{filename}': {e}\n")
                log_area.see(tk.END)
                error_count += 1

    final_message = f"Renomeação concluída!\nRenomeados: {renamed_count}, Erros: {error_count}"
    log_area.insert(tk.END, final_message + "\n")
    log_area.see(tk.END)
    messagebox.showinfo("Renomeação Concluída", final_message)


# --- Classe da Aplicação Tkinter (GUI) ---
class ImageOptimizerApp:
    def __init__(self, master):
        self.master = master
        master.title("César Brasil Fotografia - Otimizador e Renomeador de Imagens")
        master.geometry("850x800")
        master.resizable(True, True)

        # Variáveis de controle
        self.input_folder = tk.StringVar(master)
        self.output_folder = tk.StringVar(master)
        self.max_width = tk.IntVar(master, value=OPTIMIZATION_PRESETS["Web Geral"]["max_width"])
        self.jpeg_quality = tk.IntVar(master, value=OPTIMIZATION_PRESETS["Web Geral"]["jpeg_quality"])
        self.png_optimize = tk.BooleanVar(master, value=OPTIMIZATION_PRESETS["Web Geral"]["png_optimize"])
        self.output_format_choice = tk.StringVar(master, value=OPTIMIZATION_PRESETS["Web Geral"]["output_format"])
        self.batch_rename_enabled = tk.BooleanVar(master, value=False)
        self.batch_rename_prefix = tk.StringVar(master)
        self.delete_original_images = tk.BooleanVar(master, value=False)
        self.rename_only_mode = tk.BooleanVar(master, value=False)

        # --- Frames para organização ---
        self.path_frame = tk.LabelFrame(master, text="Pastas", padx=10, pady=10)
        self.path_frame.pack(pady=10, padx=10, fill="x")

        self.options_frame = tk.LabelFrame(master, text="Opções de Otimização", padx=10, pady=10)
        self.options_frame.pack(pady=10, padx=10, fill="x")

        self.rename_frame = tk.LabelFrame(master, text="Opções de Renomeação em Lote", padx=10, pady=10)
        self.rename_frame.pack(pady=10, padx=10, fill="x")
        
        self.danger_zone_frame = tk.LabelFrame(master, text="Zona de Perigo", padx=10, pady=10, fg="red")
        self.danger_zone_frame.pack(pady=10, padx=10, fill="x")

        self.button_frame = tk.Frame(master, padx=10, pady=5)
        self.button_frame.pack(pady=5, padx=10)

        self.log_frame = tk.LabelFrame(master, text="Log de Processamento", padx=10, pady=10)
        self.log_frame.pack(pady=5, padx=10, fill="both", expand=True)

        # --- Componentes da GUI ---

        # Pasta de Entrada
        tk.Label(self.path_frame, text="Pasta de Origem:").grid(row=0, column=0, sticky="w", pady=2)
        tk.Entry(self.path_frame, textvariable=self.input_folder, width=60).grid(row=0, column=1, padx=5, pady=2)
        tk.Button(self.path_frame, text="Procurar...", command=self.browse_input_folder).grid(row=0, column=2, padx=5, pady=2)

        # Pasta de Saída
        tk.Label(self.path_frame, text="Pasta de Destino:").grid(row=1, column=0, sticky="w", pady=2)
        self.output_entry = tk.Entry(self.path_frame, textvariable=self.output_folder, width=60)
        self.output_entry.grid(row=1, column=1, padx=5, pady=2)
        self.output_button = tk.Button(self.path_frame, text="Procurar...", command=self.browse_output_folder)
        self.output_button.grid(row=1, column=2, padx=5, pady=2)

        # Opções de Otimização
        # Presets
        tk.Label(self.options_frame, text="Escolher Preset:").grid(row=0, column=0, sticky="w", pady=2)
        self.preset_combobox = ttk.Combobox(self.options_frame,
                                            values=list(OPTIMIZATION_PRESETS.keys()),
                                            state="readonly",
                                            width=30)
        self.preset_combobox.set("Web Geral")
        self.preset_combobox.grid(row=0, column=1, columnspan=2, sticky="ew", padx=5, pady=2)
        self.preset_combobox.bind("<<ComboboxSelected>>", self.apply_preset)

        tk.Label(self.options_frame, text="Largura Máxima (px):").grid(row=1, column=0, sticky="w", pady=2)
        self.max_width_entry = tk.Entry(self.options_frame, textvariable=self.max_width, width=10)
        self.max_width_entry.grid(row=1, column=1, sticky="w", padx=5, pady=2)
        tk.Label(self.options_frame, text="Defina '0' para não redimensionar largura.").grid(row=1, column=2, sticky="w", padx=5, pady=2)

        tk.Label(self.options_frame, text="Qualidade JPEG/WebP (0-100):").grid(row=2, column=0, sticky="w", pady=2)
        self.jpeg_quality_entry = tk.Entry(self.options_frame, textvariable=self.jpeg_quality, width=10)
        self.jpeg_quality_entry.grid(row=2, column=1, sticky="w", padx=5, pady=2)

        self.png_optimize_checkbox = tk.Checkbutton(self.options_frame, text="Otimizar PNGs (Compressão Llossless)", variable=self.png_optimize)
        self.png_optimize_checkbox.grid(row=3, column=0, sticky="w", pady=2)

        # Formato de Saída
        tk.Label(self.options_frame, text="Formato de Saída:").grid(row=4, column=0, sticky="w", pady=2)
        self.format_combobox = ttk.Combobox(self.options_frame,
                                            values=["webp", "jpeg", "png"],
                                            textvariable=self.output_format_choice,
                                            state="readonly",
                                            width=10)
        self.format_combobox.grid(row=4, column=1, sticky="w", padx=5, pady=2)

        # Renomeação em Lote
        self.batch_rename_enabled_checkbox = tk.Checkbutton(self.rename_frame, text="Ativar Renomeação em Lote", variable=self.batch_rename_enabled,
                       command=self.toggle_batch_rename)
        self.batch_rename_enabled_checkbox.grid(row=0, column=0, sticky="w", pady=5)


        self.batch_rename_label = tk.Label(self.rename_frame, text="Prefixo do Novo Nome:")
        self.batch_rename_label.grid(row=1, column=0, sticky="w", pady=2)
        self.batch_rename_entry = tk.Entry(self.rename_frame, textvariable=self.batch_rename_prefix, width=40)
        self.batch_rename_entry.grid(row=1, column=1, sticky="ew", padx=5, pady=2)
        tk.Label(self.rename_frame, text="Ex: 'ensaio_casamento_001.webp'").grid(row=1, column=2, sticky="w", padx=5, pady=2)

        # NOVO: Apenas Renomear
        self.rename_only_checkbox = tk.Checkbutton(self.rename_frame, text="Apenas Renomear Imagens Existentes (Ignora otimização)",
                                                   variable=self.rename_only_mode, command=self.toggle_rename_only_mode)
        self.rename_only_checkbox.grid(row=2, column=0, columnspan=3, sticky="w", pady=5)


        # --- Zona de Perigo: Deletar Originais ---
        self.delete_original_checkbox = tk.Checkbutton(self.danger_zone_frame,
                                                       text="APAGAR IMAGENS ORIGINAIS APÓS OTIMIZAÇÃO (Cuidado!)",
                                                       variable=self.delete_original_images,
                                                       fg="red",
                                                       font=('Arial', 10, 'bold'))
        self.delete_original_checkbox.pack(pady=5, anchor="w")
        tk.Label(self.danger_zone_frame, text="Recomenda-se fazer um backup antes de usar esta opção.", fg="red").pack(pady=2, anchor="w")


        # Botões de Processar
        self.optimize_button = tk.Button(self.button_frame, text="Otimizar e Salvar Novas Imagens", command=self.start_optimization)
        self.optimize_button.pack(side=tk.LEFT, padx=5, pady=10)

        self.rename_button = tk.Button(self.button_frame, text="Apenas Renomear Imagens Existentes", command=self.start_rename_only, state=tk.DISABLED)
        self.rename_button.pack(side=tk.LEFT, padx=5, pady=10)

        # Área de Log
        self.log_text = scrolledtext.ScrolledText(self.log_frame, wrap=tk.WORD, height=18, width=80)
        self.log_text.pack(fill="both", expand=True)

        # --- CHAMA toggle_rename_only_mode e toggle_batch_rename AGORA (DEPOIS QUE TODOS OS WIDGETS ESTÃO CRIADOS) ---
        # Garante que toggle_batch_rename é chamado antes para configurar o estado inicial da renomeação
        self.toggle_batch_rename() 
        self.toggle_rename_only_mode()


    def browse_input_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.input_folder.set(folder_selected)
            if self.rename_only_mode.get(): # Define a pasta de saída igual à de entrada se estiver no modo "apenas renomear"
                self.output_folder.set(folder_selected)


    def browse_output_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.output_folder.set(folder_selected)

    def apply_preset(self, event=None):
        if self.rename_only_mode.get(): # Não aplica presets no modo apenas renomear
            return

        selected_preset_name = self.preset_combobox.get()
        preset = OPTIMIZATION_PRESETS.get(selected_preset_name)
        if preset:
            self.max_width.set(preset["max_width"])
            self.jpeg_quality.set(preset["jpeg_quality"])
            self.png_optimize.set(preset["png_optimize"])
            self.output_format_choice.set(preset["output_format"])

    def toggle_batch_rename(self):
        # Esta função controla o estado do prefixo e da checkbox "Ativar Renomeação em Lote"
        # baseando-se se o modo "apenas renomear" está ativo OU se a checkbox normal está marcada.
        is_rename_only = self.rename_only_mode.get()
        batch_rename_checked = self.batch_rename_enabled.get()

        # O prefixo e o label devem estar habilitados se:
        # 1. O modo "apenas renomear" está ativo, OU
        # 2. A checkbox "Ativar Renomeação em Lote" está marcada (e o modo "apenas renomear" não está ativo)
        should_be_enabled = is_rename_only or batch_rename_checked

        self.batch_rename_label.config(state="normal" if should_be_enabled else "disabled")
        self.batch_rename_entry.config(state="normal" if should_be_enabled else "disabled")

        if not should_be_enabled:
            self.batch_rename_prefix.set("") # Limpa o prefixo se desativado


    def toggle_rename_only_mode(self):
        is_rename_only = self.rename_only_mode.get()

        # Desabilita/habilita campos de otimização
        state = "disabled" if is_rename_only else "normal"
        self.output_entry.config(state=state)
        self.output_button.config(state=state)
        self.preset_combobox.config(state="readonly" if not is_rename_only else "disabled")
        self.max_width_entry.config(state=state)
        self.jpeg_quality_entry.config(state=state)
        self.png_optimize_checkbox.config(state=state)
        self.format_combobox.config(state="readonly" if not is_rename_only else "disabled")
        
        # O campo de apagar originais SÓ é desabilitado no modo 'Apenas Renomear'
        # Em modo normal, ele está sempre habilitado.
        self.delete_original_checkbox.config(state=state)


        # Ajusta os botões principais
        self.optimize_button.config(state="disabled" if is_rename_only else "normal")
        self.rename_button.config(state="normal" if is_rename_only else "disabled")

        # Gerencia a checkbox "Ativar Renomeação em Lote"
        if is_rename_only:
            self.batch_rename_enabled.set(True) # Garante que está marcada no modo "apenas renomear"
            self.batch_rename_enabled_checkbox.config(state="disabled") # Desabilita a própria checkbox
            self.output_folder.set(self.input_folder.get()) # Define a pasta de saída igual à de entrada

        else: # Se não está no modo "apenas renomear"
            self.batch_rename_enabled_checkbox.config(state="normal") # Habilita a checkbox novamente
            # O estado da batch_rename_enabled.set(False) deve ser manual do usuário se ele quiser desativar


        # Chama toggle_batch_rename novamente para garantir que o prefixo está no estado correto
        # com base nas novas condições do rename_only_mode
        self.toggle_batch_rename()


    def start_optimization(self):
        input_f = self.input_folder.get()
        output_f = self.output_folder.get()
        max_w = self.max_width.get()
        jpeg_q = self.jpeg_quality.get()
        png_opt = self.png_optimize.get()
        output_fmt = self.output_format_choice.get()

        batch_rename = self.batch_rename_enabled.get()
        batch_prefix = self.batch_rename_prefix.get().strip() if batch_rename else ""
        delete_originals = self.delete_original_images.get()

        # Validações
        if not input_f or not os.path.isdir(input_f):
            messagebox.showerror("Erro", "Por favor, selecione uma pasta de origem válida.")
            return
        if not output_f:
            messagebox.showerror("Erro", "Por favor, selecione uma pasta de destino.")
            return
        
        if delete_originals and input_f == output_f:
            confirm = messagebox.askyesno("ATENÇÃO EXTREMA!", 
                                          "Você selecionou a opção de APAGAR ORIGINAIS e a pasta de ORIGEM é IGUAL à pasta de DESTINO. "
                                          "Isso significa que as fotos originais serão PERDIDAS e SUBSTITUÍDAS pelas otimizadas. "
                                          "TEM CERTEZA ABSOLUTA que deseja continuar? É ALTAMENTE RECOMENDADO USAR PASTAS DIFERENTES OU FAZER BACKUP!")
            if not confirm:
                return
        elif input_f == output_f:
            confirm = messagebox.askyesno("Atenção!", "A pasta de origem e destino são as mesmas. Isso pode sobrescrever suas imagens originais. Deseja continuar?")
            if not confirm:
                return

        if batch_rename and not batch_prefix:
             messagebox.showerror("Erro", "Por favor, digite um prefixo para a renomeação em lote, ou desative a opção.")
             return

        self.log_text.delete(1.0, tk.END)
        self.log_text.insert(tk.END, "Iniciando processo...\n")
        self.log_text.see(tk.END)

        try:
            optimize_images_for_web(
                input_f,
                output_f,
                max_w,
                jpeg_q,
                png_opt,
                output_fmt,
                batch_prefix,
                delete_originals,
                self.log_text
            )
        except Exception as e:
            messagebox.showerror("Erro de Processamento", f"Ocorreu um erro inesperado: {e}")
            self.log_text.insert(tk.END, f"\nERRO FATAL: {e}\n")
            self.log_text.see(tk.END)

    def start_rename_only(self):
        input_f = self.input_folder.get()
        batch_prefix = self.batch_rename_prefix.get().strip()

        if not input_f or not os.path.isdir(input_f):
            messagebox.showerror("Erro", "Por favor, selecione uma pasta de origem válida para renomear.")
            return

        if not batch_prefix:
            messagebox.showerror("Erro", "Por favor, digite um prefixo para a renomeação em lote.")
            return

        confirm = messagebox.askyesno("Confirmar Renomeação",
                                      f"Você está prestes a renomear todas as imagens na pasta '{input_f}' "
                                      f"com o prefixo '{batch_prefix}'. Esta ação é irreversível. Deseja continuar?")
        if not confirm:
            return

        self.log_text.delete(1.0, tk.END)
        self.log_text.insert(tk.END, "Iniciando modo 'Apenas Renomear'...\n")
        self.log_text.see(tk.END)

        try:
            rename_existing_images(input_f, batch_prefix, self.log_text)
        except Exception as e:
            messagebox.showerror("Erro de Renomeação", f"Ocorreu um erro inesperado durante a renomeação: {e}")
            self.log_text.insert(tk.END, f"\nERRO FATAL: {e}\n")
            self.log_text.see(tk.END)


if __name__ == "__main__":
    root = tk.Tk()
    app = ImageOptimizerApp(root)
    root.mainloop()