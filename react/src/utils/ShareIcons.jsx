import {
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
  } from "react-share";
  import React from "react";
import { HStack, Link } from "@chakra-ui/react";
import {GithubOutlined} from '@ant-design/icons';





  export default function ShareIcons(){

    const title = 'Daily Telos Dapp';
    const desc = 'Decentralized blockchain event scheduler and community management platform.';



    return(
        <>
             <HStack  mt={2} w='full'  justify='center' gap='12px'>

                      <TwitterShareButton
                        title={title}
                        via={"daily_telos"}
                        url={`https://dailyTelos.net`}
                        hashtags={[
                          "TLSO",
                          "DailyTelos",
                          "Telos",
                        ]}
                      >
                        <TwitterIcon size={23} round />
                      </TwitterShareButton>
                      <RedditShareButton
                        url={`${title} https://dailyTelos.net/`}
                      >
                        <RedditIcon size={23} round />
                      </RedditShareButton>
                      <TelegramShareButton
                        url={`${title} | ${desc} | TSLO
 https://dailyTelos.net`}
                      >
                        <TelegramIcon size={23} round />
                      </TelegramShareButton>
                      
                      
                      <Link href='https://github.com/bunyCloud/CalendarDapp' isExternal>

                      <GithubOutlined style={{fontSize:'21px', marginTop:2}} bg='transparent'/>
                        </Link>                      
                      
                    </HStack>
        </>
    )
  }