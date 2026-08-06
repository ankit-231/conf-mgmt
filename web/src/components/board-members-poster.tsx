import Image from "next/image"

import { STATIC_BASE_URL } from "@/config/api-endpoints"

type Member = {
  role: string
  name: string
  photo: string
}

// Member photos are served by Django's static files (not committed to this
// repo) at STATIC_BASE_URL/board-poster/*.png.
const boardPosterAsset = (fileName: string) =>
  `${STATIC_BASE_URL}/board-poster/${fileName}`

const president: Member = {
  role: "President",
  name: "Rtr. Pankaj Chaudhary",
  photo: boardPosterAsset("pankaj.png"),
}

const members: Member[] = [
  { role: "IPP", name: "Rtr. Bindu Neupane", photo: boardPosterAsset("bindu.png") },
  { role: "Vice President", name: "Rtr. Asmita Chapagain", photo: boardPosterAsset("asmita.png") },
  { role: "Secretary", name: "Rtr. Kristina Bastola", photo: boardPosterAsset("kristina.png") },
  { role: "Treasurer", name: "Rtr. Santoshi Kharel", photo: boardPosterAsset("santoshi.png") },
  { role: "Club Advisor", name: "Rtr. Sushmita Ghimire", photo: boardPosterAsset("sushmita.png") },
  { role: "Club Advisor", name: "Rtr. Utsav Bikram Thapa", photo: boardPosterAsset("utsav.png") },
  { role: "Club Advisor", name: "Rtr. Sabina Khanal", photo: boardPosterAsset("sabina.png") },
  { role: "Learning Facilitator", name: "Rtr. Sayujya Satyal", photo: boardPosterAsset("sayujya.png") },
  { role: "Young Leader Contact", name: "Rtr. Ankit Khanal", photo: boardPosterAsset("ankit.png") },
  { role: "International Service Director", name: "Rtr. Rubina Timsina", photo: boardPosterAsset("rubina.png") },
  { role: "Public Image Chair", name: "Rtr. Samriddhi Khadka", photo: boardPosterAsset("samriddhi.png") },
]

function BoardMembersPoster() {
  return (
    <div
      className="mx-auto w-[800px] px-6 pt-7 pb-9 font-sans"
      style={{ background: "linear-gradient(180deg, #f2e6e8 0%, #eee0e3 100%)" }}
    >
      <div className="rounded-md bg-white px-[26px] pt-[22px] pb-8 shadow-[0_2px_20px_rgba(90,20,40,0.08)]">
        <div className="mb-[18px] text-center">
          <div className="text-[26px] font-extrabold tracking-[1.5px] text-brand-maroon">
            ROTARACT CLUB OF KATHMANDU METROPOLIS
          </div>
        </div>

        <Image
          src={boardPosterAsset("header_logos.png")}
          alt="Rotaract and partner logos"
          width={800}
          height={100}
          className="mb-[22px] block h-auto w-full object-contain"
        />

        <div className="mb-8 text-center">
          <span className="inline-block rounded-[22px] bg-brand-maroon px-[26px] py-[9px] text-[16px] font-extrabold tracking-[0.8px] text-white">
            ROTA YEAR 2026/2027 BOARD MEMBERS
          </span>
        </div>

        <div className="mb-[34px] flex flex-col items-center">
          <div className="mb-2.5 size-[150px] overflow-hidden rounded-full border-[3px] border-brand-maroon">
            <Image
              src={president.photo}
              alt={president.name}
              width={150}
              height={150}
              className="size-full object-cover object-[center_top]"
            />
          </div>
          <div className="text-[15px] font-extrabold tracking-[0.3px] text-brand-maroon">
            {president.role}
          </div>
          <div className="text-[15px] text-[#2a2a2a]">{president.name}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-9 gap-y-[26px]">
          {members.map((member) => (
            <div key={member.name} className="flex w-[130px] flex-col items-center">
              <div className="mb-[9px] size-[88px] overflow-hidden rounded-full">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={88}
                  height={88}
                  className="size-full object-cover object-[center_top]"
                />
              </div>
              <div className="text-center text-[13px] leading-[1.3] font-extrabold text-brand-maroon">
                {member.role}
              </div>
              <div className="text-center text-[13px] text-[#2a2a2a]">{member.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { BoardMembersPoster }
