import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse, quote
from urllib.request import urlopen

from yt_dlp import YoutubeDL


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")


def format_duration(seconds: Optional[int]) -> str:
    if not seconds:
        return ""
    seconds = int(round(seconds))
    hours, rem = divmod(seconds, 3600)
    minutes, secs = divmod(rem, 60)
    if hours:
        return f"{hours:d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:d}:{secs:02d}"


def clean_description(text: Optional[str], limit: int = 600) -> str:
    if not text:
        return ""
    text = text.replace("\r", " ").replace("\n", " ")
    text = re.sub(r"\s+", " ", text).strip()
    if limit and len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0] + "…"
    return text


@dataclass
class VideoEntry:
    category: str
    title: str
    url: str
    credit: str
    id: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    publish_date: Optional[str] = None
    thumbnail: Optional[str] = None


RAW_VIDEOS = [
    # Videoclipes
    ("Videoclipes", "ANNA SUAV - BARRIL 092", "https://www.youtube.com/watch?v=45IkLA0P5zs", "Edição, colorização e efeitos. 2025."),
    ("Videoclipes", "AQNO - LATINO BREGA LOVE: Um Show de Amores (Álbum Visual)", "https://www.youtube.com/watch?v=ZbVy81U7N2c&t=1369s", "Montagem. 2025."),
    ("Videoclipes", "AQNO, Gang do Eletro, Casa de Maniva - Maniçoba (Videoclipe Oficial)", "https://www.youtube.com/watch?v=aMsi6Lb3G8g", "Montagem. 2025."),
    ("Videoclipes", "AQNO, Dona Onete - Jambu No Cuxá (Videoclipe Oficial)", "https://www.youtube.com/watch?v=-Q8PN0fVzGA", "Montagem. 2025."),
    ("Videoclipes", "RUAN BORGES X VITOR Z3R0 - JÁ DEU", "https://www.youtube.com/watch?v=r4AzyCfFAkE", "Direção, edição e roteiro. 2025."),
    ("Videoclipes", "RAWI - Desejo (Visualizer)", "https://www.youtube.com/watch?v=VMM-JtbNIjw", "Montagem, colorização e finalização. 2024."),
    ("Videoclipes", "RAWI - Futuro (Visualizer)", "https://www.youtube.com/watch?v=01YgTWUaPY0", "Montagem, colorização e finalização. 2024."),
    ("Videoclipes", "RAWI - Força (Visualizer)", "https://www.youtube.com/watch?v=fdI33bUd9sg", "Montagem, colorização e finalização. 2024."),
    ("Videoclipes", "RAWI - Liberdade (Visualizer)", "https://www.youtube.com/watch?v=yUT2PrvfDEE", "Montagem, colorização e finalização. 2024."),
    ("Videoclipes", "FLOR DE MURURÉ - DONA MULAMBO (Videoclipe Oficial)", "https://www.youtube.com/watch?v=iDRG_ktmjX0", "Montagem e finalização. 2024."),
    ("Videoclipes", "BELLA - A ÚLTIMA CARTA", "https://www.youtube.com/watch?v=rMMYVGDr7W0", "Montagem. 2023."),
    ("Videoclipes", "BELLA - Meu Lugar (Visualizer)", "https://www.youtube.com/watch?v=hIpKdBoP-TE", "Montagem. 2023."),
    ("Videoclipes", "BELLA - Como Um Sonho (Visualizer)", "https://www.youtube.com/watch?v=mis5k_LxvAI", "Montagem. 2023."),
    ("Videoclipes", "BELLA - Namoradeira (Visualizer)", "https://www.youtube.com/watch?v=m34u3AMGOPg", "Montagem. 2023."),
    ("Videoclipes", "BELLA - Cada Vez (Visualizer)", "https://www.youtube.com/watch?v=yyQ8Pp1KNV8", "Montagem. 2023."),
    ("Videoclipes", "BELLA - Medo de Gostar", "https://www.youtube.com/watch?v=tXzvs9dADcc", "Montagem. 2023."),
    ("Videoclipes", "APOLLO - Sonhos", "https://www.youtube.com/watch?v=PEyCCa-64FY", "Montagem. 2023."),
    ("Videoclipes", "RUAN BORGES - Transbordar (Clipe Oficial)", "https://www.youtube.com/watch?v=IO1OVsAnDEQ", "Direção e edição. 2021."),

    # Ao vivo
    ("Ao Vivo", "PINGADO #7 - DJ WILL LOVE", "https://www.youtube.com/watch?v=Seyt6OAeER8", "Montagem e colorização. 2025."),
    ("Ao Vivo", "PINGADO #6 - Juliana Sinimbú", "https://www.youtube.com/watch?v=b_izQiZCflk", "Montagem e colorização. 2025."),
    ("Ao Vivo", "PINGADO #5 - Reggaetown", "https://www.youtube.com/watch?v=ABlKbmUfjZo", "Montagem e colorização. 2025."),
    ("Ao Vivo", "PINGADO #4 - Layse e Os Sinceros", "https://www.youtube.com/watch?v=JIOYmkhhbLA", "Montagem e colorização. 2025."),
    ("Ao Vivo", "PINGADO #3 - Bella", "https://www.youtube.com/watch?v=D9hRM38lxPU", "Montagem e colorização. 2024."),
    ("Ao Vivo", "PINGADO #2 - Alba Mariah", "https://www.youtube.com/watch?v=nnYHec0BYu0", "Montagem e colorização. 2024."),

    # Campanhas
    ("Campanhas", "CDP - 50 Anos", "https://vimeo.com/962628455", "Montagem, correção de cor e finalização. 2024."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Teaser", "https://www.youtube.com/shorts/DIw8W2lQ7zQ", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Soho", "https://www.youtube.com/watch?v=3mQMUuv3IGk", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Attaboy", "https://www.youtube.com/watch?v=33FC1zbaRMg", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Amor Y Amargo", "https://www.youtube.com/watch?v=IXZdRK2PoX4", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Old Fashioned", "https://www.youtube.com/watch?v=EgrgQgGi8fc", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - The Long Walker", "https://vimeo.com/954913479", "Montagem. 2023."),
    ("Campanhas", "JOHNNIE WALKER & Marcelino Antepastos - Katana Kitten", "https://vimeo.com/954910046", "Montagem. 2023."),
    ("Campanhas", "MOR - Momentos de Molezinha", "https://vimeo.com/954916641", "Montagem. 2022."),

    # Documentários
    ("Documentários", "Mãos da Transição - Trailer", "https://www.youtube.com/watch?v=yZR-1ueOLAw", "Roteiro e montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Willians", "https://www.youtube.com/watch?v=WUSdT2SgYAM", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Júlia", "https://www.youtube.com/watch?v=GftbUfFN0Go", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Patrícia", "https://www.youtube.com/watch?v=DuoxSVRs8xM", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Ariana", "https://www.youtube.com/watch?v=jrstieVkIw0", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Tales", "https://www.youtube.com/watch?v=u8DSA5KNlok", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Ana Karolliny", "https://www.youtube.com/watch?v=BkwdcBJmUh0", "Montagem. 2025."),
    ("Documentários", "Mãos da Transição - Episódio Gleice", "https://www.youtube.com/watch?v=rrv80t4qxM8", "Montagem. 2025."),

    # Moda
    ("Moda", "A Festa Disco 2025", "https://www.youtube.com/watch?v=EnRdV516f_8", "Montagem, colorização e finalização. 2025."),
    ("Moda", "Prêmio BLVD Moda & Arte 2024", "https://www.youtube.com/watch?v=TDHZf4Nz5JI", "Montagem, colorização e finalização. 2024."),

    # Conteúdo Redes Sociais
    ("Conteúdo Redes Sociais", "Casa de Artes Tiago de Pinho - Auto da Compadecida", "https://www.youtube.com/watch?v=nkoF3d5MYb4", "Montagem e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Natura - Lançamento Ekos Eau de Parfum", "https://www.instagram.com/p/DNDxItfMo8H/", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Natura - Bastidores", "https://www.instagram.com/p/DNGzXA8xifU/", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Mari Goldfarb - Grande Rio", "https://www.youtube.com/shorts/xemQmLDcq1A", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Kuro Neko - Reels Inauguração", "https://www.youtube.com/shorts/HvmVNAvTeTI", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Kuro Neko - Neko News", "https://www.youtube.com/shorts/EJKH7RAy0Ho", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Kuro Neko - Central de Atendimento", "https://www.youtube.com/shorts/uwaX4TQX1FQ", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Lançamento Álbum CDRP Felipe Cordeiro", "https://www.youtube.com/shorts/mssiAkRTcCo", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Amazon Deli - Reels Geral", "https://www.youtube.com/shorts/vHPUXA9iEd0", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Kuro Neko - Vem Aí", "https://www.youtube.com/shorts/o8oqSgPuj5E", "Montagem, colorização e finalização. 2024."),
    ("Conteúdo Redes Sociais", "Famiglia da Pasta - Receita Ancho", "https://www.youtube.com/shorts/pYxk0TIKE3A", "Montagem, colorização e finalização. 2025."),
    ("Conteúdo Redes Sociais", "Famiglia da Pizza - Dia das Mães", "https://www.youtube.com/shorts/fNUmaviawbQ", "Montagem, colorização e finalização. 2025."),

    # Festivais
    ("Festivais", "Festival Vivo Sunset", "https://www.youtube.com/shorts/9ZLPb10POG4", "Montagem, colorização e finalização. 2024."),

    # Institucionais
    ("Institucionais", "Escola Co-League Parauapebas 2025", "https://www.youtube.com/watch?v=Q9VQiPjdMNE", "Montagem, colorização e finalização. 2025."),
    ("Institucionais", "Botibarco 2024 - Videocase", "https://www.youtube.com/watch?v=hm38wiE3F7c", "Montagem, colorização e finalização. 2025."),
    ("Institucionais", "Natura - 10 anos Ecoparque Benevides", "https://vimeo.com/974612498", "Montagem. 2024."),
    ("Institucionais", "Bioeconomy Amazon Summit", "https://www.youtube.com/watch?v=ycmQkM8iE9w", "Montagem, colorização e finalização. 2024."),
    ("Institucionais", "Festival Co-League Belém", "https://www.youtube.com/watch?v=aOCrnnusZrQ", "Montagem, colorização e finalização. 2024."),

    # Aftermovies
    ("Aftermovies", "Festival Claro Que É Rock 2024", "https://www.youtube.com/watch?v=4lmRJ8fAUMo", "Montagem e finalização. 2024."),
    ("Aftermovies", "Festival Ambienta 2024", "https://www.youtube.com/watch?v=k_cKnFWuYTM", "Montagem e finalização. 2024."),
    ("Aftermovies", "Mirai Dance Show", "https://www.youtube.com/watch?v=vCbw3UjVaPE", "Montagem e colorização. 2024."),
    ("Aftermovies", "Bruno Mars Dance Show", "https://www.youtube.com/watch?v=lY2ALDOeEKk", "Montagem e colorização. 2024."),

    # Outros
    ("Outros", "Cabron Studios - Demo Reel 2025", "https://www.youtube.com/watch?v=nPu2TuKtosc", "Montagem. 2025."),
]


OPTIONS = {
    "skip_download": True,
    "quiet": True,
    "nocheckcertificate": True,
    "ignoreerrors": False,
}


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    scheme = 'https'
    netloc = parsed.netloc.lower()
    path = parsed.path

    if 'youtube.com' in netloc:
        query_params = [(k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=False)
                        if k not in {'t', 'time_continue', 'start', 'feature', 'si', 'pp', 'list'}]
        query = urlencode(query_params)
    else:
        query = parsed.query

    return urlunparse((scheme, netloc, path, parsed.params, query, ''))


def extract_video(url: str) -> dict:
    with YoutubeDL(OPTIONS) as ydl:
        info = ydl.extract_info(url, download=False)
    if info.get("_type") == "playlist" and "entries" in info and info["entries"]:
        info = info["entries"][0]
    thumbnails = info.get("thumbnails") or []
    thumbnail = None
    if thumbnails:
        thumbnails = sorted(thumbnails, key=lambda t: t.get("width", 0), reverse=True)
        thumbnail = thumbnails[0].get("url")
    return {
        "id": info.get("id"),
        "title": info.get("title"),
        "description": info.get("description"),
        "upload_date": info.get("upload_date"),
        "duration": info.get("duration"),
        "thumbnail": thumbnail or info.get("thumbnail"),
    }


def extract_vimeo_oembed(url: str) -> dict:
    api_url = f"https://vimeo.com/api/oembed.json?url={quote(url, safe='')}"
    with urlopen(api_url) as response:
        data = json.loads(response.read().decode('utf-8'))
    description = data.get("description") or ""
    description = re.sub(r"<[^>]+>", " ", description)
    description = re.sub(r"\s+", " ", description).strip()
    duration = data.get("duration")
    upload_date = data.get("upload_date")
    if upload_date:
        try:
            upload_date = datetime.fromisoformat(upload_date).strftime("%d %b %Y")
        except ValueError:
            pass
    return {
        "id": str(data.get("video_id") or slugify(data.get("title", ""))),
        "title": data.get("title"),
        "description": description,
        "upload_date": upload_date,
        "duration": duration,
        "thumbnail": data.get("thumbnail_url"),
    }


def build_entries():
    entries = []
    for category, label, url, credit in RAW_VIDEOS:
        normalized_url = normalize_url(url)
        try:
            info = extract_video(normalized_url)
        except Exception as exc:  # pragma: no cover - diagnostic output
            if 'vimeo.com' in normalized_url:
                try:
                    info = extract_vimeo_oembed(normalized_url)
                except Exception as exc_vimeo:  # pragma: no cover - diagnostic output
                    print(f"Erro ao extrair {normalized_url}: {exc_vimeo}", file=sys.stderr)
                    continue
            else:
                print(f"Erro ao extrair {normalized_url}: {exc}", file=sys.stderr)
                continue
        description = clean_description(info.get("description"))
        if not description:
            description = credit
        duration_str = format_duration(info.get("duration"))
        upload_date = info.get("upload_date")
        formatted_date = None
        if upload_date:
            try:
                formatted_date = datetime.strptime(upload_date, "%Y%m%d").strftime("%d %b %Y")
            except ValueError:
                formatted_date = upload_date
        entry = VideoEntry(
            category=category,
            title=info.get("title") or label,
            url=normalized_url,
            credit=credit,
            id=f"{slugify(category)}-{info.get('id') or slugify(label)}",
            duration=duration_str,
            description=description,
            publish_date=credit,
            thumbnail=info.get("thumbnail")
        )
        entry.thumbnail = info.get("thumbnail")
        entries.append(entry)
    return entries


def main():
    entries = build_entries()
    output = []
    for e in entries:
        item = {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "publishDate": e.publish_date,
            "category": e.category,
            "duration": e.duration or "",
            "videoUrl": e.url,
        }
        if e.thumbnail:
            item["thumbnail"] = e.thumbnail
        output.append(item)
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
